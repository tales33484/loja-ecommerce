import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../loader/Loader";
import { useTranslation } from "react-i18next";
// Firebase
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../firebase/config";

const Login = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    document.getElementById("my-modal-4").checked = false;

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success(t("login.success"));
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.code);
        setIsLoading(false);
      });

    setEmail("");
    setPassword("");
  };

  const provider = new GoogleAuthProvider();
  const googleSignIn = () => {
    setIsLoading(true);
    document.getElementById("my-modal-4").checked = false;
    signInWithPopup(auth, provider)
      .then(() => {
        toast.success(t("login.success"));
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.code);
        setIsLoading(false);
      });
  };

  const AllFieldsRequired = Boolean(email) && Boolean(password);

  return (
    <>
      {isLoading && <Loader />}

      <div className="py-6">
        <div className="flex bg-base-200 rounded-lg shadow-lg overflow-hidden mx-auto max-w-4xl">
          <div className="w-full px-8 pt-4 pb-6">
            <p className="text-xl text-base-content/70 text-center">
              {t("login.welcome")}
            </p>

            <div
              className="btn btn-outline w-full mt-4 gap-2"
              onClick={googleSignIn}
            >
              <FcGoogle size={22} />
              {t("login.google_button")}
            </div>

            <div className="divider text-xs text-base-content/50 uppercase">
              {t("login.or_email")}
            </div>

            <form className="form-control" onSubmit={handleSubmit}>
              <div>
                <label className="label-text font-bold mb-2 block text-base-content">
                  {t("login.email_label")}
                </label>
                <input
                  className="input input-bordered w-full bg-base-100 border-base-300"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mt-4 relative">
                <div className="flex justify-between">
                  <label className="label-text font-bold mb-2 text-base-content">
                    {t("login.password_label")}
                  </label>
                  <Link
                    to="/reset"
                    className="text-xs text-base-content/60"
                    onClick={() =>
                      (document.getElementById("my-modal-4").checked = false)
                    }
                  >
                    {t("login.forgot_password")}
                  </Link>
                </div>

                <input
                  className="input input-bordered w-full bg-base-100 border-base-300"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-10 right-3 cursor-pointer text-base-content/60"
                >
                  {showPassword ? (
                    <AiFillEye size={26} />
                  ) : (
                    <AiFillEyeInvisible size={26} />
                  )}
                </span>
              </div>

              <div className="mt-4 w-full flex flex-col items-center justify-center">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={!AllFieldsRequired}
                >
                  {t("login.login_button")}
                </button>

                {/* Modal */}
                <input type="checkbox" id="my-modal-69" className="modal-toggle" />
                <label htmlFor="my-modal-69" className="modal cursor-pointer">
                  <label
                    className="modal-box bg-base-200 text-base-content"
                    htmlFor=""
                  >
                    <h3 className="text-lg font-bold">
                      {t("login.modal_title")}
                    </h3>
                    <p className="py-4">
                      {t("login.modal_text")} <br />
                      <a
                        href="mailto:kartikpavan2@gmail.com"
                        className="link link-error font-semibold"
                      >
                        {t("login.modal_emailtext")}
                      </a>
                    </p>
                  </label>
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
