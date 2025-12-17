import { useEffect, useState } from "react";
// Firebase
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

const useFetchDocument = (collectionName, documentId) => {
  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDocument = async () => {
      try {
        const docRef = doc(db, collectionName, documentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDocument({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document exists!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDocument();
  }, [collectionName, documentId]);

  return { document, isLoading };
};

export default useFetchDocument;
