import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Firebase
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

const ChangeOrderStatus = ({ order }) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(order.orderStatus || "");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  if (!order || !order.id) {
    console.error("Document ID is missing in the order object:", order);
    return <p className="text-red-500">Error: Document ID is missing.</p>;
  }

  const docId = order.id;

  const changeStatus = async (e) => {
    e.preventDefault();
    if (!status) return toast.error("Select a status first.");

    setIsLoading(true);

    try {
      // Atualizar documentos diretamente pelo ID do documento
      const ordersRef = doc(db, "orders", docId);
      const orders2Ref = doc(db, "orders2", docId);

      await updateDoc(ordersRef, {
        orderStatus: status,
        editedAt: Timestamp.now(),
      });

      await updateDoc(orders2Ref, {
        orderStatus: status,
        editedAt: Timestamp.now(),
      });

      toast.success(t("ChangeOrderStatus.toastSuccess", { status }));
      navigate("/admin/orders");
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className="w-full md:w-96 p-2 rounded-sm shadow-lg">
        <h1 className="text-2xl">{t("ChangeOrderStatus.title")}</h1>

        <form onSubmit={changeStatus} className="form-control">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="select select-secondary w-full max-w-xs"
          >
            <option disabled value="">
              {t("ChangeOrderStatus.selectPlaceholder")}
            </option>
            <option value="orderPlaced">{t("ChangeOrderStatus.status.orderPlaced")}</option>
            <option value="processing">{t("ChangeOrderStatus.status.processing")}</option>
            <option value="shipped">{t("ChangeOrderStatus.status.shipped")}</option>
            <option value="delivered">{t("ChangeOrderStatus.status.delivered")}</option>
          </select>

          <button
            type="submit"
            className="btn btn-primary-content btn-sm mt-2"
          >
            {t("ChangeOrderStatus.updateButton")}
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangeOrderStatus;
