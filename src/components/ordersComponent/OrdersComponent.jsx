import React from "react";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../../utils/formatPrice";
import { useNavigate } from "react-router-dom";

const OrdersComponent = ({ orders, user, admin }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleUserClick(orderId) {
    navigate(`/order-details/${orderId}`);
  }

  function handleAdminClick(orderId) {
    navigate(`/admin/order-details/${orderId}`);
  }

  return (
    <main>
      {!orders.length ? (
        <h1 className="text-2xl font-bold">
          {t("orderscomponent.noOrders")}
        </h1>
      ) : (
        <div>
          <p className="text-lg font-light">
            {t("orderscomponent.openOrder")} (
            {admin ? (
              <span className="font-semibold text-primary">
                {t("orderscomponent.changeOrderStatus")}
              </span>
            ) : (
              <span className="font-semibold text-primary">
                {t("orderscomponent.trackOrderStatus")}
              </span>
            )}
            )
          </p>

          {orders.map((order, index) => {
            const { id, orderDate, orderAmount, orderStatus, email } = order;

            return (
              <section
                className="w-full my-6 shadow-md rounded-md cursor-pointer hover:bg-base-200 duration-200"
                key={index}
                onClick={() => {
                  user ? handleUserClick(id) : handleAdminClick(id);
                }}
              >
                <div className="p-4 bg-base-200">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row gap-x-10">
                      <p className="text-gray-500 text-sm md:text-lg">
                        {t("orderscomponent.orderPlaced")} : <br />
                        <span className="text-primary">{orderDate}</span>
                      </p>

                      <p className="text-gray-500 text-sm md:text-lg">
                        {t("orderscomponent.shipTo")} : <br />
                        <span className="text-primary">
                          {email.split("@")[0]}
                        </span>
                      </p>
                    </div>

                    <p className="text-gray-500 text-sm md:text-lg">
                      {t("orderscomponent.total")} :
                      <span className="text-primary">
                        {formatPrice(orderAmount)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <p className="text-sm md:text-lg">
                    {t("orderscomponent.id")} :
                    <span className="font-semibold"> {id}</span>
                  </p>

                  <p className="text-sm md:text-lg">
                    {t("orderscomponent.status")} : <br />
                    <span
                      className={`font-semibold ${
                        orderStatus !== "Item(s) Delivered"
                          ? "text-neutral"
                          : "text-green-600"
                      }`}
                    >
                      {orderStatus}
                    </span>
                  </p>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default OrdersComponent;
