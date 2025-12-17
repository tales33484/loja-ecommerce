import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";

import ChangeOrderStatus from "../changeOrderStatus/ChangeOrderStatus";
import { OrderTable, Steps } from "../../components";
import { useTranslation } from "react-i18next";

const OrderDetailsComponent = ({ order, admin, user, orderId }) => {
  const { t } = useTranslation();

  const { shippingAddress } = order;

  return (
    <>
      <section className="p-4 w-full bg-primary-content flex items-center">
        <article className="w-full flex flex-col lg:flex-row items-center justify-between gap-y-5">
          <div className="w-full mx-auto md:px-6 ">
            <section>
              <h1 className="text-xl md:text-3xl font-bold text-secondary-content">
                {t("OrderDetailsComponent.orderDetails")}
              </h1>

              <p className="font-semibold text-lg my-2">
                {t("OrderDetailsComponent.orderId")} :
                <span className="font-light text-gray-500"> {order.id}</span>
              </p>

              <p className="font-semibold text-lg my-2">
                {t("OrderDetailsComponent.orderAmount")} :
                <span className="font-light text-gray-500">
                  {formatPrice(order.orderAmount)}
                </span>
              </p>

              <p className="font-semibold text-lg my-2">
                {t("OrderDetailsComponent.orderStatus")} :
                <span
                  className={`font-bold ${
                    order.orderStatus === "Item(s) Delivered"
                      ? "text-green-600"
                      : "text-primary"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </p>
            </section>

            {user && <Steps order={order} />}

            {admin && shippingAddress && (
              <div className="mt-4 space-y-1">
                <p className="font-semibold text-lg">
                  {t("OrderDetailsComponent.recipientName")} :
                  <span className="font-light"> {shippingAddress.name}</span>
                </p>
                <p className="font-semibold text-lg">
                  {t("OrderDetailsComponent.phone")} :
                  <span className="font-light"> {shippingAddress.phone}</span>
                </p>
                <p className="font-semibold text-lg">
                  {t("OrderDetailsComponent.shippingAddress")} :
                  <span className="font-light">
                    {shippingAddress.street}, {shippingAddress.number}{" "}
                    {shippingAddress.complement && `- ${shippingAddress.complement}`},{" "}
                    {shippingAddress.neighborhood},{" "}
                    {shippingAddress.city} - {shippingAddress.state},{" "}
                    CEP: {shippingAddress.cep}
                  </span>
                </p>
              </div>
            )}
          </div>

          {admin && <ChangeOrderStatus order={order} orderId={orderId} />}
        </article>
      </section>

      <main className="py-5">
        <div className="pb-5">
          {admin ? (
            <Link to="/admin/orders" className="link active my-2">
              &larr; {t("OrderDetailsComponent.backToAllOrders")}
            </Link>
          ) : (
            <Link to="/my-orders" className="link active my-2">
              &larr; {t("OrderDetailsComponent.backToAllOrders")}
            </Link>
          )}
        </div>

        <OrderTable order={order} user={user} />
      </main>
    </>
  );
};

export default OrderDetailsComponent;
