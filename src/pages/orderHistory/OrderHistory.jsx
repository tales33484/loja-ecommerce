import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const OrderHistory = () => {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const sub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setOrders([]);
      }
    });
    return () => sub();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "orders2"),
          where("userId", "==", userId)
        );

        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(list);
      } catch (err) {
        console.error("Error loading orders:", err);
        setErrorMsg(err.message);
      }

      setLoading(false);
    };

    loadOrders();
  }, [userId]);

  if (loading) return <p>{t("orderhistory.loading")}</p>;
  if (!userId) return <p>{t("orderhistory.loginRequired")}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{t("orderhistory.title")}</h2>

      {errorMsg && (
        <p style={{ color: "red" }}>
          {t("orderhistory.error")}: {errorMsg}
        </p>
      )}

      {orders.length === 0 ? (
        <p>{t("orderhistory.empty")}</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ccc",
              padding: 15,
              marginBottom: 10,
              borderRadius: 8,
            }}
          >
            <h3>
              {t("orderhistory.order")} #{order.id}
            </h3>

            <p>
              <strong>{t("orderhistory.total")}:</strong>{" "}
              R$
              {order.orderAmount
                ? order.orderAmount.toFixed(2)
                : "0.00"}
            </p>

            <p>
              <strong>{t("orderhistory.status")}:</strong>{" "}
              {order.orderStatus || t("orderhistory.notAvailable")}
            </p>

            <p>
              <strong>{t("orderhistory.date")}:</strong>{" "}
              {order.createdAt
                ? new Date(
                    order.createdAt.seconds * 1000
                  ).toLocaleString()
                : t("orderhistory.noDate")}
            </p>

            <h4>{t("orderhistory.items")}:</h4>
            <ul>
              {(order.cartItems || []).map((item, idx) => (
                <li key={idx}>
                  {item.name} — {item.qty}x — R${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
