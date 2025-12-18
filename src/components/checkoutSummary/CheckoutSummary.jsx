import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

import { clearCart } from "../../redux/slice/cartSlice";
import { clearCheckout } from "../../redux/slice/checkoutSlice";

import Loader from "../loader/Loader";

const stripePromise = loadStripe(
  "pk_test_51ScEVMFVTttmYlY5CZJc8FepubcHkdEL3VOWRHnKh6WuZkfpYREhBvRvsKKx2BA6Zg9FJHcIu0QB5smvxcqVouP300YWbEbOLo"
);

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stripe = useStripe();
  const elements = useElements();

  const { cartItems } = useSelector((s) => s.cart);
  const { shippingAddress, shippingValue, shippingReady } = useSelector(
    (s) => s.checkout
  );
  const { email, userId } = useSelector((s) => s.auth);

  const [loading, setLoading] = useState(false);

  //  Segurança: subtotal recalculado localmente
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * (item.qty || 1),
    0
  );

  const totalAmount = subtotal + Number(shippingValue || 0);

  //  REGRA FINAL DE PAGAMENTO
  const canPay =
    cartItems.length > 0 &&
    shippingReady === true &&
    subtotal > 0;

  //  Salvar pedido
  const saveOrder = async (purchaseId) => {
    await setDoc(doc(db, "orders", purchaseId), {
      userId,
      email,
      cartItems,
      shippingAddress,
      shippingValue: Number(shippingValue || 0),
      orderAmount: totalAmount,
      orderStatus: "Order Placed",
      createdAt: Timestamp.now(),
    });

    await setDoc(doc(db, "orders2", purchaseId), {
      userId,
      orderAmount: totalAmount,
      shippingValue: Number(shippingValue || 0),
      productIds: cartItems.map((i) => i.id),
      createdAt: Timestamp.now(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  BLOQUEIO TOTAL DE SEGURANÇA
    if (!stripe || !elements || !canPay) {
      toast.warning(t("checkoutsummary.completeShippingFirst"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/.netlify/functions/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(totalAmount * 100),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Erro ao criar pagamento");
      }

      const { client_secret } = await res.json();

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        const purchaseId = uuidv4();
        await saveOrder(purchaseId);

        dispatch(clearCart());
        dispatch(clearCheckout());

        toast.success(t("checkoutsummary.paymentSuccess"));
        navigate("/checkout-success");
      }
    } catch (err) {
      console.error(err);
      toast.error(t("checkoutsummary.paymentError"));
    }

    setLoading(false);
  };

  return (
    <section className="w-full max-w-4xl mx-auto mt-6 space-y-6">
      {/* RESUMO */}
      <div className="bg-base-100 p-6 rounded shadow">
        <h2 className="text-2xl font-light mb-4">
          {t("checkoutsummary.orderSummary")}
        </h2>

        {cartItems.map((item) => (
          <div key={item.id} className="border p-2 mb-2 rounded">
            <p className="font-medium">{item.name}</p>
            <p>
              {t("checkoutsummary.quantity")}: {item.qty || 1}
            </p>
            <p>
              {t("checkoutsummary.unitPrice")}: {formatPrice(item.price)}
            </p>
            <p>
              {t("checkoutsummary.total")}:{" "}
              {formatPrice(item.price * (item.qty || 1))}
            </p>
          </div>
        ))}

        <div className="border-t mt-4 pt-2 space-y-1">
          <p>
            {t("checkoutsummary.subtotal")}: {formatPrice(subtotal)}
          </p>
          <p>
            {t("checkoutsummary.shipping")}:{" "}
            {formatPrice(Number(shippingValue || 0))}
          </p>
          <p className="font-bold text-lg">
            {t("checkoutsummary.total")}: {formatPrice(totalAmount)}
          </p>
        </div>
      </div>

      {/* PAGAMENTO */}
      <div className="bg-base-100 p-6 rounded shadow">
        <h2 className="text-xl font-light mb-4">
          {t("checkoutsummary.payment")}
        </h2>

        <form onSubmit={handleSubmit}>
          <CardElement
            className="border p-4 rounded mb-4"
            options={{ hidePostalCode: true }}
          />

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading || !canPay}
          >
            {loading ? <Loader /> : t("checkoutsummary.pay")}
          </button>

          {!shippingReady && (
            <p className="text-sm text-warning mt-3">
              {t("checkoutsummary.selectShippingWarning")}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default function CheckoutSummary() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
