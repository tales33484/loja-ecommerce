import { doc, getDoc } from "firebase/firestore";
import Breadcrumbs from "../breadcrumbs/Breadcrumbs";
import { Link, useParams } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import Loader from "../loader/Loader";
import ReviewComponent from "../review/ReviewComponent";
import ReviewList from "../review/ReviewList";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useEffect, useState } from "react";
import { db } from "../../firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, decreaseCart, calculateTotalQuantity } from "../../redux/slice/cartSlice";
import { useTranslation } from "react-i18next";

const ProductDetails = () => {
  const { t } = useTranslation();
  const { cartItems } = useSelector((store) => store.cart);
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(0); // trigger para atualizar reviews

  // 🔎 Carrega produto
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setProduct(docSnap.data());
      setIsLoading(false);
    };
    fetchProduct();
  }, [id]);

  const add2CartFunction = (product) => {
    dispatch(addToCart({ ...product, id }));
    dispatch(calculateTotalQuantity());
  };
  const decreaseQty = (product) => {
    dispatch(decreaseCart({ ...product, id }));
    dispatch(calculateTotalQuantity());
  };
  const currentItem = cartItems.find((item) => item.id === id);

  return (
    <>
      {isLoading && <Loader />}
      <Breadcrumbs type={product.name} />
      <section className="w-full mx-auto p-4 md:p-10 lg:w-9/12 md:px-6">
        <h1 className="text-2xl font-semibold">{t("productdetails.title")}</h1>
        <Link to="/all" className="link">
          &larr; {t("productdetails.back_to_products")}
        </Link>

        {/* Produto */}
        <article className="flex flex-col md:flex-row items-start justify-between py-4 gap-x-4">
          <div className="w-full md:w-1/3 flex items-center justify-center border-2 rounded-md">
            <LazyLoadImage
              src={product.imageURL}
              alt={product.name}
              className="w-96 h-96 object-contain"
              placeholderSrc="https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"
              effect="blur"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl mb-2">{product.name}</h1>
            <h2 className="text-primary px-2 py-2 max-w-max font-bold text-lg md:text-2xl mb-2">
              {formatPrice(product.price)}
            </h2>
            <p className="text-gray-500 mb-2">{product.description}</p>
            <p className="font-semibold mb-2">
              {t("productdetails.sku")}: <span className="font-light ml-1">{id}</span>
            </p>
            <p className="font-semibold mb-2">
              {t("productdetails.brand")}: <span className="font-light ml-1">{product.brand}</span>
            </p>

            {currentItem && (
              <div className="btn-group items-center mb-2">
                <button className="btn btn-sm btn-outline" onClick={() => decreaseQty(product)}>-</button>
                <button className="btn btn-lg btn-ghost disabled">{currentItem.qty}</button>
                <button className="btn btn-sm btn-outline" onClick={() => add2CartFunction(product)}>+</button>
              </div>
            )}
            <button className="btn btn-primary btn-active" onClick={() => add2CartFunction(product)}>
              {t("productdetails.add_to_cart")}
            </button>
          </div>
        </article>

        {/* Reviews */}
        <section className="rounded-md shadow-lg mt-6 bg-base-100">
          <div className="flex flex-col gap-4 p-4">
            <ReviewComponent
              productId={id}
              onReviewSubmitted={() => setRefresh(r => r + 1)}
            />
            <ReviewList key={refresh} productId={id} />
          </div>
        </section>
      </section>
    </>
  );
};

export default ProductDetails;
