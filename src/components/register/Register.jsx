import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../loader/Loader";
import { useTranslation } from "react-i18next";
// Firebase
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/config";

const Register = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t("register.password_mismatch"));
    }

    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success(t("register.success"));
        setIsLoading(false);
        document.getElementById("my-modal-4").checked = false;
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.code, error.message);
        setIsLoading(false);
      });

    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const AllFieldsRequired =
    Boolean(email) && Boolean(password) && Boolean(confirmPassword);

  return (
    <>
      {isLoading && <Loader />}

      <div className="py-6 w-72 md:w-96">
        <div className="flex bg-base-200 rounded-lg shadow-lg overflow-hidden mx-auto max-w-4xl">
          <div className="w-full px-8 pt-4 pb-6">
            <p className="text-lg text-base-content/70 text-center">
              {t("register.title")}
            </p>

            <form onSubmit={handleSubmit} className="form-control">
              <div>
                <label className="label-text font-bold mb-2 block text-base-content">
                  {t("register.email_label")}
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
                <label className="label-text font-bold mb-2 text-base-content">
                  {t("register.password_label")}
                </label>

                <input
                  className="input input-bordered w-full bg-base-100 border-base-300"
                  type={`${showPassword ? "test" : "password"}`}
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

              <div className="mt-4">
                <label className="label-text font-bold mb-2 text-base-content">
                  {t("register.confirm_password_label")}
                </label>
                <input
                  className="input input-bordered w-full bg-base-100 border-base-300"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={!AllFieldsRequired}
                >
                  {t("register.register_button")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
