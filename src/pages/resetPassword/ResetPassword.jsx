import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
// FIREBASE
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import Loader from "../../components/loader/Loader";

const ResetPassword = () => {
	const { t } = useTranslation();

	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [err, setErr] = useState("");

	const resetPasswordHandler = (e) => {
		e.preventDefault();
		setIsLoading(true);

		sendPasswordResetEmail(auth, email)
			.then(() => {
				toast.info(t("resetpassword.toastCheckEmail"));
				setErr(t("resetpassword.checkEmailMessage"));
				setIsLoading(false);
				setEmail("");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				setErr(`${errorCode} : ${errorMessage}`);
				setIsLoading(false);
			});
	};

	return (
		<>
			{isLoading && <Loader />}

			<main className="w-full page flex items-center justify-center">
				<div className="w-96 h-auto shadow-xl rounded-md px-4 py-6">
					<h1 className="text-2xl font-bold text-center">
						{t("resetpassword.title")}
					</h1>

					{err && (
						<h1 className="alert shadow-lg text-gray-700 border-l-4 border-error my-4">
							{err}
						</h1>
					)}

					<div className="alert shadow-lg text-gray-700 border-l-4 border-primary my-4">
						{t("resetpassword.description")}
					</div>

					<form className="form-control" onSubmit={resetPasswordHandler}>
						<label className="label-text font-bold mb-2 block">
							{t("resetpassword.emailLabel")}
						</label>

						<input
							type="email"
							className="input input-bordered input-secondary w-full"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>

						<button type="submit" className="btn mt-3">
							{t("resetpassword.submitButton")}
						</button>
					</form>
				</div>
			</main>
		</>
	);
};

export default ResetPassword;
