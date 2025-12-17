import React from "react";
import { useTranslation } from "react-i18next";

const Pagination = ({ productPerPage, currentPage, setCurrentPage, totalProducts }) => {
	const { t } = useTranslation();

	function prevPage() {
		setCurrentPage((prev) => (prev <= 1 ? prev : prev - 1));
	}

	function nextPage() {
		setCurrentPage((prev) =>
			prev >= Math.ceil(totalProducts / productPerPage) ? prev : prev + 1
		);
	}

	return (
		<div className="w-full flex flex-col items-center justify-center">
			<div className="btn-group">
				<button className="btn" onClick={prevPage}>
					«
				</button>
				<button className="btn">
					{t("Pagination.page")} {currentPage}
				</button>
				<button className="btn" onClick={nextPage}>
					»
				</button>
			</div>
			<p className="font-semibold">
				<span className="text-primary">
					{t("Pagination.page")} {currentPage}{" "}
				</span>
				{t("Pagination.of")}
				<span> {Math.ceil(totalProducts / productPerPage)} </span>
			</p>
		</div>
	);
};

export default Pagination;
