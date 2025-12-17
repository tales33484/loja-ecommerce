import { useEffect, useState } from "react";
import { toast } from "react-toastify";
// Firebase
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { db } from "../firebase/config";

const useFetchCollection = (collectionName, userId = null, isAdmin = false) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCollection = async () => {
      setIsLoading(true);
      try {
        const colRef = collection(db, collectionName);
        let q;

        if (isAdmin) {
          // Admin vê todos os documentos
          q = query(colRef, orderBy("createdAt", "desc"));
        } else if (userId) {
          // Usuário normal vê apenas suas ordens
          q = query(
            colRef,
            where("userId", "==", userId),
            orderBy("createdAt", "desc")
          );
        } else {
          // Usuário não logado não vê nada
          setData([]);
          setIsLoading(false);
          return;
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const allData = [];
          querySnapshot.forEach((doc) => {
            allData.push({ id: doc.id, ...doc.data() });
          });
          setData(allData);
          setIsLoading(false);
        });
        return () => unsubscribe();
      } catch (error) {
        toast.error(error.message);
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [collectionName, userId, isAdmin]);

  return { data, isLoading };
};

export default useFetchCollection;