import React from "react";
import { useTranslation } from "react-i18next";

const Countdown = () => {
   const { t } = useTranslation();

   return (
      <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
         <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono md:text-2xl">
               <span style={{ "--value": 50 }}></span>
            </span>
            {t("Countdown.days")}
         </div>
         <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono md:text-2xl">
               <span style={{ "--value": 10 }}></span>
            </span>
            {t("Countdown.hours")}
         </div>
         <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono md:text-2xl">
               <span style={{ "--value": 24 }}></span>
            </span>
            {t("Countdown.minutes")}
         </div>
         <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
            <span className="countdown font-mono md:text-2xl">
               <span style={{ "--value": 1 }}></span>
            </span>
            {t("Countdown.seconds")}
         </div>
      </div>
   );
};

export default Countdown;
