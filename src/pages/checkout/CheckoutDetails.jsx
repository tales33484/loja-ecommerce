import { useState } from "react";
import { Breadcrumbs } from "../../components";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingAddress } from "../../redux/slice/checkoutSlice";
import CheckoutShipping from "../../components/checkoutShipping/CheckoutShipping";
import CheckoutSummary from "../../components/checkoutSummary/CheckoutSummary";

const defaultValues = {
  name: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "", // novo campo
  city: "",
  state: "",
  phone: "",
};

export default function CheckoutDetails() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartItems = useSelector((store) => store.cart.cartItems);

  const [shippingAddress, setShippingAddress] = useState(defaultValues);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [showShipping, setShowShipping] = useState(false);

  const handleShipping = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress(shippingAddress));
    setButtonPressed(true);
    setShowShipping(true);
  };

  const allFieldsFilled =
    shippingAddress.name &&
    shippingAddress.cep &&
    shippingAddress.street &&
    shippingAddress.number &&
    shippingAddress.neighborhood && // validação
    shippingAddress.city &&
    shippingAddress.state &&
    shippingAddress.phone;

  return (
    <main className="w-full">
      <Breadcrumbs
        type={t("checkoutdetails.breadcrumbCart")}
        checkout={t("checkoutdetails.breadcrumbCheckout")}
      />

      <section className="w-full mx-auto p-4 lg:p-10 md:px-6 flex flex-col items-center gap-10 h-full">
        {/* FORMULÁRIO DE ENDEREÇO */}
        <div className="p-6 rounded-md shadow-lg bg-base-100 w-full max-w-md">
          <h1 className="text-3xl font-light mb-6 text-center">
            {t("checkoutdetails.shippingAddressTitle")}
          </h1>
          <form
            onSubmit={handleSubmit}
            className="form-control flex flex-col gap-4"
          >
            <input
              type="text"
              name="name"
              value={shippingAddress.name}
              placeholder="Nome completo"
              onChange={handleShipping}
              required
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="cep"
              value={shippingAddress.cep}
              placeholder="CEP"
              onChange={handleShipping}
              required
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="street"
              value={shippingAddress.street}
              placeholder="Rua"
              onChange={handleShipping}
              required
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="number"
              value={shippingAddress.number}
              placeholder="Número"
              onChange={handleShipping}
              required
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="complement"
              value={shippingAddress.complement}
              placeholder="Complemento"
              onChange={handleShipping}
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="neighborhood"
              value={shippingAddress.neighborhood}
              placeholder="Bairro"
              onChange={handleShipping}
              required
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="city"
              value={shippingAddress.city}
              placeholder="Cidade"
              onChange={handleShipping}
              required
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="state"
              value={shippingAddress.state}
              placeholder="Estado"
              onChange={handleShipping}
              required
              className="input input-bordered w-full"
            />
            <input
              type="text"
              name="phone"
              value={shippingAddress.phone}
              placeholder="Telefone"
              onChange={handleShipping}
              required
              className="input input-bordered w-full"
            />
            <button
              type="submit"
              className="btn btn-primary mt-2 w-full"
              disabled={!allFieldsFilled || buttonPressed}
            >
              Calcular Frete
            </button>
          </form>
        </div>

        {/* COMPONENTE DE FRETE */}
        {showShipping && cartItems.length > 0 && (
          <CheckoutShipping
            cartItems={cartItems}
            shippingAddress={shippingAddress}
          />
        )}

        {/* COMPONENTE DE RESUMO */}
        {showShipping && <CheckoutSummary />}
      </section>
    </main>
  );
}
