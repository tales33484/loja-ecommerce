import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// remove acentos e normaliza
const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const processReviewText = async (comment) => {
  const normalizedComment = normalize(comment);

  const deleteRef = doc(db, "blacklist", "delete");
  const censorRef = doc(db, "blacklist", "censor");

  const [deleteSnap, censorSnap] = await Promise.all([
    getDoc(deleteRef),
    getDoc(censorRef),
  ]);

  const deleteWords = deleteSnap.exists()
    ? deleteSnap.data().words || []
    : [];

  const censorWords = censorSnap.exists()
    ? censorSnap.data().words || []
    : [];

  // 🔴 DELETE (prioridade máxima)
  for (const phrase of deleteWords) {
    if (normalizedComment.includes(normalize(phrase))) {
      return {
        blocked: true,
        reason: "delete",
        text: null,
      };
    }
  }

  // 🟡 CENSOR
  let censoredText = comment;

  for (const phrase of censorWords) {
    const regex = new RegExp(phrase, "gi");
    censoredText = censoredText.replace(regex, "********");
  }

  return {
    blocked: false,
    reason: censoredText !== comment ? "censor" : "clean",
    text: censoredText,
  };
};
