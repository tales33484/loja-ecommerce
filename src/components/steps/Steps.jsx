import React from "react";
import { useTranslation } from "react-i18next";

const Steps = ({ order }) => {
  const { t } = useTranslation();

  const steps = [
    t("Steps.orderPlaced"),
    t("Steps.processing"),
    t("Steps.shipped"),
    t("Steps.delivered"),
  ];

  const getStepClass = (index) => {
    const statusOrderMap = {
      "Order Placed": 0,
      "Processing...": 1,
      "Item(s) Shipped": 2,
      "Item(s) Delivered": 3,
    };
    return index <= statusOrderMap[order.orderStatus] ? "step step-primary" : "step";
  };

  return (
    <ul className="steps steps-vertical lg:steps-horizontal">
      {steps.map((label, index) => (
        <li
          key={index}
          data-content={index === 3 ? "✓" : "●"}
          className={index === 3 ? "step step-primary" : getStepClass(index)}
        >
          <pre>{label}</pre>
        </li>
      ))}
    </ul>
  );
};

export default Steps;
