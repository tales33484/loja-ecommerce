// src/components/adminRoute/AdminRoute.jsx
import { useEffect, useState } from "react";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Rota protegida para administradores
export const AdminRoute = ({ children }) => {
  const [allowed, setAllowed] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        toast.error("Você precisa estar logado.");
        navigate("/");
        return setAllowed(false);
      }

      try {
        const token = await user.getIdTokenResult();

        if (token.claims.admin === true) {
          setAllowed(true);
        } else {
          toast.error("Acesso restrito a administradores.");
          navigate("/");
          setAllowed(false);
        }
      } catch (err) {
        console.error("Erro ao verificar claims do usuário:", err);
        toast.error("Erro ao autenticar usuário.");
        navigate("/");
        setAllowed(false);
      }
    });

    return () => unsub();
  }, [navigate]);

  if (allowed === null) return null; // ainda carregando

  return allowed ? children : null;
};

// Link ou componente visível apenas para admin
export const AdminOnlyLink = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setShow(false);
        return;
      }

      try {
        const token = await user.getIdTokenResult();
        setShow(token.claims.admin === true);
      } catch (err) {
        console.error("Erro ao verificar claims do usuário:", err);
        setShow(false);
      }
    });

    return () => unsub();
  }, []);

  return show ? children : null;
};

// ⚠️ Default export para compatibilidade com imports antigos
export default AdminRoute;
