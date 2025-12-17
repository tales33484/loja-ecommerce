import React, { useState } from "react";
import Login from "../login/Login";
import Register from "../register/Register";
import { useTranslation } from "react-i18next";

const Modal = () => {
  const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      {/* checkbox controla se o modal está aberto */}
      <input type="checkbox" id="my-modal-4" className="modal-toggle" />
      
      <label htmlFor="my-modal-4" className="modal cursor-pointer">
        <label className="modal-box relative max-w-md" htmlFor="">
          {/* Tabs */}
          <div className="tabs tabs-boxed mb-4">
            <button
              className={`tab flex-1 ${isLogin ? "tab-active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              {t("modal.login_modal")}
            </button>
            <button
              className={`tab flex-1 ${isLogin ? "" : "tab-active"}`}
              onClick={() => setIsLogin(false)}
            >
              {t("modal.register_modal")}
            </button>
          </div>

          {/* Conteúdo do modal */}
          <div>
            {isLogin ? <Login /> : <Register />}
          </div>
        </label>
      </label>
    </>
  );
};

export default Modal;
