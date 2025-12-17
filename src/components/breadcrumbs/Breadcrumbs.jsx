import React from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";

const Breadcrumbs = ({ type, checkout, stripe }) => {
  const { t } = useTranslation();

  // Classe para o link ativo
  const activeLink = ({ isActive }) =>
    isActive ? "font-semibold text-secondary" : "font-normal";

  return (
    <section className="h-20 md:h-36 w-full bg-base-200 flex items-center">
      <div className="w-full mx-auto px-2 lg:w-9/12 md:px-6 flex flex-wrap gap-2 items-center">
        <Link to="/" className="text-lg md:text-xl font-bold text-base-content">
          {t("breadcrumbs.home")}
        </Link>
        <span className="text-base-content">/</span>

        <NavLink to="/all" className={activeLink}>
          <span className="text-lg md:text-primary">{t("breadcrumbs.products")}</span>
        </NavLink>

        {type && (
          <>
            <span className="text-base-content">/</span>
            <NavLink to="#" className={activeLink}>
              <span className="text-lg md:text-primary">{type}</span>
            </NavLink>
          </>
        )}

        {checkout && (
          <>
            <span className="text-base-content">/</span>
            <NavLink to="#" className={activeLink}>
              <span className="text-lg md:text-xl">{checkout}</span>
            </NavLink>
          </>
        )}

        {stripe && (
          <>
            <span className="text-base-content">/</span>
            <NavLink to="#" className={activeLink}>
              <span className="text-lg md:text-xl">{stripe}</span>
            </NavLink>
          </>
        )}
      </div>
    </section>
  );
};

export default Breadcrumbs;
