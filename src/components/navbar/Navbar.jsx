import React, { useEffect, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminOnlyLink } from "../adminRoute/AdminRoute";
// Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { removeActiveUser, setActiveUser } from "../../redux/slice/authSlice";
import { calculateSubtotal, calculateTotalQuantity } from "../../redux/slice/cartSlice";
import { formatPrice } from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";
// Theme utils
import { setTheme, applyTheme } from "../../utils/themeManager";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { isUserLoggedIn, userName } = useSelector((store) => store.auth);
  const { totalAmount, totalQuantity, cartItems } = useSelector((store) => store.cart);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [currentTheme, setCurrentTheme] = useState(applyTheme());

  // Lista de temas permitidos para todos
  const allowedThemes = ["light", "dark", "lemonade", "night", "coffee"];

  // Textos exibidos para cada tema (editar antes do deploy)
  const themeTexts = {
    light: "Claro",
    dark: "Escuro",
    lemonade: "Limão",
    night: "Noite",
    coffee: "Café",
  };

  // Monitor usuário
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!displayName) setDisplayName(user.email.split("@")[0]);
        dispatch(
          setActiveUser({
            email: user.email,
            userName: user.displayName ? user.displayName : displayName,
            userId: user.uid,
          })
        );
      } else {
        setDisplayName("");
        dispatch(removeActiveUser());
      }
    });
  }, [displayName, dispatch]);

  function logOutUser() {
    signOut(auth)
      .then(() => {
        toast.success(t("navbar.logout_success"));
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.code, error.message);
      });
  }

  let activeStyle = { borderBottom: "2px solid white" };

  useEffect(() => {
    dispatch(calculateTotalQuantity());
    dispatch(calculateSubtotal());
  }, [dispatch, cartItems]);

  // Language Selector
  const LanguageSelector = () => (
    <li className="hover:bg-gray-100 cursor-pointer rounded-md">
      <details className="dropdown-left">
        <summary className="flex justify-between items-center px-2 py-1">
          {t("navbar.language")} <span className="ml-1">▼</span>
        </summary>
        <ul className="bg-base-100 p-2 rounded-md shadow-md">
          <li>
            <button
              className="w-full text-left px-2 py-1 hover:bg-gray-200 rounded"
              onClick={() => i18n.changeLanguage("pt")}
            >
              Português
            </button>
          </li>
          <li>
            <button
              className="w-full text-left px-2 py-1 hover:bg-gray-200 rounded"
              onClick={() => i18n.changeLanguage("en")}
            >
              English
            </button>
          </li>
        </ul>
      </details>
    </li>
  );

  // Theme Selector
  const ThemeSelector = () => {
    const handleSelect = (theme) => {
      setTheme(theme);
      setCurrentTheme(theme);
    };

    return (
      <li className="hover:bg-gray-100 cursor-pointer rounded-md">
        <details className="dropdown-left">
          <summary className="flex justify-between items-center px-2 py-1">
            Tema <span className="ml-1">▼</span>
          </summary>
          <ul className="bg-base-100 p-2 rounded-md shadow-md max-h-60 overflow-y-auto">
            {allowedThemes.map((t) => (
              <li key={t}>
                <button
                  className={`w-full text-left px-2 py-1 rounded ${
                    currentTheme === t ? "bg-primary text-primary-content" : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleSelect(t)}
                >
                  {themeTexts[t] || t}
                </button>
              </li>
            ))}
          </ul>
        </details>
      </li>
    );
  };

  return (
    <>
      <nav className="h-[8vh] bg-neutral shadow-xl">
        <div className="navbar w-full md:w-9/12 mx-auto flex items-center justify-between">
          {/* Logo */}
          <section className="md:gap-4">
            <Link to="/" className="btn btn-ghost">
              <h1 className="logo text-white text-lg md:text-3xl">{t("navbar.site_name")}</h1>
            </Link>
          </section>

          {/* Links principais */}
          <div>
            <ul className="flex items-center gap-x-6">
              <li className="hidden lg:block text-white text-xs md:text-xl">
                <NavLink to="/" style={({ isActive }) => (isActive ? activeStyle : null)} end>
                  {t("navbar.home")}
                </NavLink>
              </li>
              <li className="hidden lg:block text-white text-xs md:text-xl">
                <NavLink to="/all" style={({ isActive }) => (isActive ? activeStyle : null)}>
                  {t("navbar.all_products")}
                </NavLink>
              </li>
              <li className="hidden lg:block text-white text-xs md:text-xl">
                <NavLink to="/contact" style={({ isActive }) => (isActive ? activeStyle : null)}>
                  {t("navbar.contact_us")}
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Carrinho e usuário */}
          <div className="md:gap-2 flex items-center">
            {/* Carrinho */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <AiOutlineShoppingCart size={30} color="white" />
                  <span className="badge badge-primary indicator-item">{totalQuantity}</span>
                </div>
              </label>
              <div tabIndex={0} className="mt-3 card card-compact dropdown-content w-52 bg-base-100 shadow-xl">
                <div className="card-body">
                  <span className="font-bold text-lg">{totalQuantity} {t("navbar.items")}</span>
                  <span>{t("navbar.subtotal")}: {formatPrice(totalAmount)}</span>
                  <div className="card-actions">
                    <Link to="/cart" className="btn btn-primary btn-block">{t("navbar.view_cart")}</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu usuário */}
            <div className="dropdown dropdown-end ml-4">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="rounded-full">
                  <img
                    src="https://png.pngtree.com/png-clipart/20210915/ourmid/pngtree-user-avatar-placeholder-white-blue-png-image_3918443.jpg"
                    alt="dp"
                    className="w-10 h-10 object-fill"
                  />
                </div>
              </label>

              <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                {userName && (
                  <li className="bg-primary text-gray-200">
                    <p className="block">{t("navbar.welcome")}, <span className="font-bold">{userName}</span></p>
                  </li>
                )}

                <div className="block lg:hidden">
                  <li><Link to="/" className="text-lg">{t("navbar.home")}</Link></li>
                  <li><Link to="/all" className="text-lg">{t("navbar.all_products")}</Link></li>
                  <li><Link to="/contact" className="text-lg">{t("navbar.contact_us")}</Link></li>
                </div>

                {isUserLoggedIn ? (
                  <>
                    <li><Link to="/my-orders" className="text-lg text-primary">{t("navbar.my_orders")}</Link></li>
                    <LanguageSelector />
                    <ThemeSelector />
                    <li>
                      <button
                        className="flex justify-between hover:bg-red-100 text-red-500 text-lg w-full px-2 py-1 rounded"
                        onClick={logOutUser}
                      >
                        {t("navbar.logout")}
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <label htmlFor="my-modal-4" className="modal-button text-lg text-primary">
                        {t("navbar.login")}
                      </label>
                    </li>
                    <LanguageSelector />
                    <ThemeSelector />
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin */}
      <AdminOnlyLink>
        <div className="min-w-screen h-10 py-1 bg-red-200 text-red-700 font-bold text-center cursor-pointer">
          <span>{t("navbar.admin")}</span>
          <Link to="/admin/home" className="btn btn-primary btn-sm mx-4">{t("navbar.view_dashboard")}</Link>
        </div>
      </AdminOnlyLink>
    </>
  );
};

export default Navbar;
