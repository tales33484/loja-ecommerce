import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  saveShippingValue,
  saveShippingReady,
} from "../../redux/slice/checkoutSlice";

const maskCep = (cep) => {
  if (!cep) return "";
  const clean = cep.replace(/\D/g, "");
  return clean.slice(0, 3) + "*****";
};

export default function CheckoutShipping({ cartItems, shippingAddress }) {
  const dispatch = useDispatch();
  const cepDestino = shippingAddress.cep;

  const [groups, setGroups] = useState([]);
  const [selectedFreights, setSelectedFreights] = useState({});
  const [loadingGroup, setLoadingGroup] = useState(null);

  // ===============================
  // AGRUPAMENTO DE PRODUTOS
  // ===============================
  useEffect(() => {
    const freeGroup = [];
    const paidGroups = {};

    cartItems.forEach((item) => {
      if (item.freeShipping) {
        freeGroup.push(item);
      } else {
        const zip = item.originZip || "00000000";
        if (!paidGroups[zip]) paidGroups[zip] = [];
        paidGroups[zip].push(item);
      }
    });

    const allGroups = [];

    // Frete grátis
    if (freeGroup.length > 0) {
      allGroups.push({
        id: "free",
        type: "free",
        products: freeGroup,
        totalQuantity: freeGroup.reduce((s, p) => s + (p.qty || 1), 0),
      });
    }

    // Fretes pagos por CEP
    Object.entries(paidGroups).forEach(([zip, products], index) => {
      allGroups.push({
        id: `paid-${index}`,
        type: "paid",
        zip,
        products,
        totalQuantity: products.reduce((s, p) => s + (p.qty || 1), 0),
        totalWeight: products.reduce(
          (s, p) => s + (p.weight || 0.5) * (p.qty || 1),
          0
        ),
        options: null,
      });
    });

    setGroups(allGroups);

    // ✅ CASO 100% FRETE GRÁTIS → LIBERA AUTOMÁTICO
    if (Object.keys(paidGroups).length === 0 && freeGroup.length > 0) {
      dispatch(saveShippingValue(0));
      dispatch(saveShippingReady(true));
    } else {
      // se existir qualquer grupo pago, bloqueia até seleção
      dispatch(saveShippingReady(false));
      dispatch(saveShippingValue(0));
      setSelectedFreights({});
    }
  }, [cartItems, dispatch]);

  // ===============================
  // CALCULAR FRETE (API)
  // ===============================
  const calculateShipping = async (group) => {
    if (!group.zip) return;
    setLoadingGroup(group.id);

    try {
      const response = await fetch("/.netlify/functions/calculateShipping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cepOrigem: group.zip,
          cepDestino,
          products: group.products.map((p, index) => ({
            id: index + 1,
            width: p.width || 13,
            height: p.height || 13,
            length: p.length || 13,
            weight: p.weight || 0.5,
            insurance_value: p.price,
            quantity: p.qty || 1,
          })),
        }),
      });

      const data = await response.json();

      setGroups((prev) =>
        prev.map((g) => (g.id === group.id ? { ...g, options: data } : g))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingGroup(null);
    }
  };

  // ===============================
  // SELECIONAR OPÇÃO DE FRETE
  // ===============================
  const selectOption = (group, option) => {
    const updated = { ...selectedFreights, [group.id]: option };
    setSelectedFreights(updated);

    const total = Object.values(updated).reduce(
      (acc, f) => acc + Number(f.price),
      0
    );

    dispatch(saveShippingValue(total));

    // verifica se todos os pagos foram selecionados
    const paidGroups = groups.filter((g) => g.type === "paid");
    const allSelected = paidGroups.every((g) => updated[g.id]);

    dispatch(saveShippingReady(allSelected));
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Detalhes do Frete</h1>

      {groups.map((group) => (
        <div
          key={group.id}
          className={`p-4 rounded shadow ${
            group.type === "free" ? "bg-base-200" : "bg-base-100"
          }`}
        >
          <h3 className="font-bold mb-2">
            {group.type === "free"
              ? "Frete Grátis"
              : `Produtos – CEP de origem ${maskCep(group.zip)}`}
          </h3>

          <p className="text-sm mb-2">
            Total de produtos: {group.totalQuantity}
            {group.type === "paid" &&
              ` | Peso total: ${group.totalWeight.toFixed(2)} kg`}
          </p>

          <ul className="mb-2">
            {group.products.map((p, idx) => (
              <li key={idx}>
                {p.name} {p.qty > 1 && `(${p.qty})`}
              </li>
            ))}
          </ul>

          {/* FRETE PAGO */}
          {group.type === "paid" && !selectedFreights[group.id] && (
            <>
              {!group.options ? (
                <button
                  className="btn btn-outline mt-3"
                  onClick={() => calculateShipping(group)}
                  disabled={loadingGroup === group.id}
                >
                  {loadingGroup === group.id
                    ? "Calculando..."
                    : "Calcular frete"}
                </button>
              ) : (
                <div className="mt-4 space-y-2">
                  {group.options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex justify-between border p-2 rounded"
                    >
                      <div>
                        <p className="font-semibold">{opt.company}</p>
                        <p>
                          {opt.name} – {opt.delivery_time} dias
                        </p>
                        <p>Valor: R$ {opt.price}</p>
                      </div>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => selectOption(group, opt)}
                      >
                        Selecionar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* FRETE GRÁTIS */}
          {group.type === "free" && (
            <div className="mt-4 p-3 bg-success text-success-content rounded">
              Frete aplicado: Grátis – R$ 0,00
            </div>
          )}

          {/* FRETE SELECIONADO */}
          {selectedFreights[group.id] && group.type === "paid" && (
            <div className="mt-4 p-3 bg-success text-success-content rounded">
              Frete selecionado: {selectedFreights[group.id].company} – R$
              {selectedFreights[group.id].price}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
