import React, { useState, useEffect } from "react";
import StarsRating from "react-star-rate";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { toast } from "react-toastify";
import { processReviewText } from "../../utils/reviewBlacklist";
import { useTranslation } from "react-i18next";

const ReviewComponent = ({ productId, onReviewSubmitted }) => {
  const { t } = useTranslation();
  const { userId, userName, isAdmin } = useSelector((state) => state.auth);

  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const checkPurchase = async () => {
      try {
        const q = query(
          collection(db, "orders2"),
          where("userId", "==", userId)
        );
        const snapshot = await getDocs(q);

        let purchased = false;
        snapshot.forEach((doc) => {
          const productIds = doc.data().productIds || [];
          if (productIds.includes(productId)) purchased = true;
        });

        setCanReview(purchased);

        const reviewsDone = JSON.parse(localStorage.getItem("reviewsDone") || "{}");
        if (reviewsDone[userId] && reviewsDone[userId].includes(productId)) {
          setAlreadyReviewed(true);
        }
      } catch (err) {
        console.error("Erro ao verificar compras:", err);
        setCanReview(false);
      }
    };

    checkPurchase();
  }, [userId, productId]);

  const submitReview = async () => {
    if (!rating || !comment.trim()) {
      toast.error(t("ReviewComponent.fillCommentAndRating"));
      return;
    }

    if (alreadyReviewed) {
      toast.error(t("ReviewComponent.alreadyReviewed"));
      return;
    }

    setLoading(true);

    try {
      const result = await processReviewText(comment);

      if (result.blocked) {
        toast.error(t("ReviewComponent.blockedContent"));
        setLoading(false);
        return;
      }

      const newReview = {
        productId,
        userId,
        userName,
        rating,
        comment: result.text,
        anonymous,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, "reviews"), newReview);

      const reviewsDone = JSON.parse(localStorage.getItem("reviewsDone") || "{}");
      if (!reviewsDone[userId]) reviewsDone[userId] = [];
      reviewsDone[userId].push(productId);
      localStorage.setItem("reviewsDone", JSON.stringify(reviewsDone));
      setAlreadyReviewed(true);

      toast.success(
        result.reason === "censor"
          ? t("ReviewComponent.sentWithCensor")
          : t("ReviewComponent.sentSuccessfully")
      );

      setRating(0);
      setComment("");
      setAnonymous(false);

      onReviewSubmitted?.({ id: docRef.id, ...newReview });
    } catch (err) {
      console.error(err);
      toast.error(t("ReviewComponent.sendError"));
    } finally {
      setLoading(false);
    }
  };

  if ((!canReview && !isAdmin) || alreadyReviewed) {
    return (
      <p className="text-primary font-senibold">
        {alreadyReviewed
          ? t("ReviewComponent.alreadyReviewed")
          : t("ReviewComponent.notPurchased")}
      </p>
    );
  }

  return (
    <section className="p-4 rounded-md bg-base-200 border border-base-300">
      <h2 className="font-semibold mb-2">{t("ReviewComponent.writeReview")}</h2>

      <StarsRating value={rating} onChange={setRating} />

      <textarea
        className="textarea textarea-bordered w-full mt-3"
        placeholder={t("ReviewComponent.placeholder")}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <label className="flex items-center gap-2 mt-3 text-sm cursor-pointer">
        <input
          type="checkbox"
          className="checkbox checkbox-sm"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
        />
        {t("ReviewComponent.anonymous")}
      </label>

      <button
        className="btn btn-primary btn-sm mt-4"
        onClick={submitReview}
        disabled={loading}
      >
        {loading ? t("ReviewComponent.sending") : t("ReviewComponent.sendReview")}
      </button>
    </section>
  );
};

export default ReviewComponent;
