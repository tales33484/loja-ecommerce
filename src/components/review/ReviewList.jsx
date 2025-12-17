import React, { useEffect, useState, useMemo } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../firebase/config";
import StarsRating from "react-star-rate";
import { onAuthStateChanged } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Pagination from "../pagination/Pagination";

const REVIEWS_PER_PAGE = 15;

const ReviewList = ({ productId }) => {
  const { t } = useTranslation();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔐 Detecta admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      user.getIdTokenResult().then((token) => {
        setIsAdmin(!!token.claims.admin);
      });
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Buscar reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;

      setLoading(true);

      try {
        const q = query(
          collection(db, "reviews"),
          where("productId", "==", productId),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const list = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();

          // Usuário comum não vê reviews anônimos
          if (!data.anonymous || isAdmin) {
            list.push({ id: docSnap.id, ...data });
          }
        });

        setReviews(list);
        setCurrentPage(1);
      } catch (error) {
        console.error("Erro ao buscar reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, isAdmin]);

  // 🧮 Paginação
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * REVIEWS_PER_PAGE;
    const end = start + REVIEWS_PER_PAGE;
    return reviews.slice(start, end);
  }, [reviews, currentPage]);

  // ❌ Excluir review (admin)
  const handleDelete = async (reviewId) => {
    if (!isAdmin) return;

    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este review?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success("Review excluído com sucesso");
    } catch (error) {
      console.error("Erro ao excluir review:", error);
      toast.error("Erro ao excluir review");
    }
  };

  if (loading) return <p>{t("ReviewList.loading")}</p>;
  if (reviews.length === 0) return <p>{t("ReviewList.noReviews")}</p>;

  return (
    <section className="rounded-md shadow-lg mt-6 bg-base-100 p-4">
      <h2 className="text-lg font-semibold mb-4">
        {t("ReviewList.title")}
      </h2>

      <div className="flex flex-col gap-4">
        {paginatedReviews.map((review) => (
          <div
            key={review.id}
            className="p-4 border border-base-300 rounded-md bg-base-200 relative"
          >
            {/* ❌ botão excluir (admin) */}
            {isAdmin && (
              <button
                onClick={() => handleDelete(review.id)}
                className="absolute top-2 right-2 btn btn-xs btn-error"
                title="Excluir review"
              >
                ✕
              </button>
            )}

            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold text-sm">
                  {review.anonymous && !isAdmin
                    ? t("ReviewList.anonymousUser")
                    : review.userName}
                </h3>
                <p className="text-xs opacity-60">
                  {new Date(
                    review.createdAt.seconds * 1000
                  ).toLocaleDateString()}
                </p>
              </div>

              <StarsRating disabled value={review.rating} />
            </div>

            <p className="text-sm leading-relaxed opacity-80">
              {review.comment}
            </p>

            {review.anonymous && isAdmin && (
              <p className="mt-2 text-xs text-warning">
                🔒 {t("ReviewList.anonymousNotice")}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* 📄 PAGINAÇÃO (se tiver mais de 15) */}
      {reviews.length > REVIEWS_PER_PAGE && (
        <div className="mt-6">
          <Pagination
            productPerPage={REVIEWS_PER_PAGE}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalProducts={reviews.length}
          />
        </div>
      )}
    </section>
  );
};

export default ReviewList;
