import React, { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { categories } from "../../utils/adminProductCategories";
import { defaultValues } from "../../utils/adminAddProductDefaultValues";
import { collection, addDoc, Timestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const AddProducts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: paramsId } = useParams();
  const { products: reduxProducts } = useSelector((store) => store.product);
  const productEdit = reduxProducts.find((item) => item.id === paramsId);

  const [product, setProduct] = useState(() =>
    detectForm(paramsId, defaultValues, productEdit)
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  function detectForm(paramsId, func1, func2) {
    return paramsId === "ADD" ? func1 : func2;
  }

  function handleInputChange(e) {
    const { name, type, checked, value } = e.target;
    setProduct({ ...product, [name]: type === "checkbox" ? checked : value });
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewImage(URL.createObjectURL(file));

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "products");

    setIsLoading(true);

    fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        setProduct({ ...product, imageURL: data.secure_url });
        toast.success(t("addproducts.toastImageSuccess"));
        setUploadProgress(100);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error(t("addproducts.toastImageError"));
        setIsLoading(false);
      });
  }

  async function addProduct(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        description: product.description,
        freeShipping: product.freeShipping || false,
        weight: Number(product.weight) || 0,
        length: Number(product.length) || 0,
        width: Number(product.width) || 0,
        height: Number(product.height) || 0,
        originZip: product.originZip || "",
        createdAt: Timestamp.now().toDate(),
      });
      setUploadProgress(0);
      setProduct(defaultValues);
      setPreviewImage(null);
      setIsLoading(false);
      toast.success(t("addproducts.toastAddSuccess"));
      navigate("/admin/all-products");
    } catch (error) {
      console.log(error.message);
      toast.error(t("addproducts.toastGenericError"));
      setIsLoading(false);
    }
  }

  async function editProduct(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      await setDoc(doc(db, "products", paramsId), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        description: product.description,
        freeShipping: product.freeShipping || false,
        weight: Number(product.weight) || 0,
        length: Number(product.length) || 0,
        width: Number(product.width) || 0,
        height: Number(product.height) || 0,
        originZip: product.originZip || "",
        createdAt: productEdit.createdAt,
        editedAt: Timestamp.now().toDate(),
      });
      setUploadProgress(0);
      setProduct(defaultValues);
      setPreviewImage(null);
      setIsLoading(false);
      toast.success(t("addproducts.toastUpdateSuccess"));
      navigate("/admin/all-products");
    } catch (error) {
      console.log(error.message);
      toast.error(t("addproducts.toastGenericError"));
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <Loader />}
      <main className="h-full border-r-2 p-1">
        <h1 className="text-xl md:text-3xl font-semibold pb-3">
          {detectForm(paramsId, t("addproducts.titleAdd"), t("addproducts.titleEdit"))}
        </h1>

        <form
          className="form-control"
          onSubmit={detectForm(paramsId, addProduct, editProduct)}
        >
          {/* Product Name */}
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">{t("addproducts.productName")}:</label>
            <input
              className="input input-bordered max-w-lg w-full border-2"
              type="text"
              placeholder={t("addproducts.productName")}
              required
              name="name"
              value={product.name}
              onChange={handleInputChange}
            />
          </div>

          {/* Product Price */}
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">{t("addproducts.productPrice")}:</label>
            <input
              className="input input-bordered max-w-lg w-full border-2"
              type="number"
              placeholder={t("addproducts.productPrice")}
              required
              name="price"
              value={product.price}
              onChange={handleInputChange}
            />
          </div>

          {/* Product Category */}
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">{t("addproducts.productCategory")}:</label>
            <select
              className="select select-bordered w-full max-w-lg"
              required
              name="category"
              value={product.category}
              onChange={handleInputChange}
            >
              <option disabled value="">{t("addproducts.chooseCategory")}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Product Brand */}
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">{t("addproducts.productBrand")}:</label>
            <input
              className="input input-bordered max-w-lg w-full border-2"
              type="text"
              placeholder={t("addproducts.productBrand")}
              required
              name="brand"
              value={product.brand}
              onChange={handleInputChange}
            />
          </div>

          {/* Product Description */}
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">{t("addproducts.productDescription")}:</label>
            <textarea
              className="textarea textarea-bordered h-32 max-w-lg w-full"
              placeholder={t("addproducts.productDescription")}
              required
              name="description"
              value={product.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Free Shipping */}
          <div className="py-2 flex items-center gap-2">
            <input
              type="checkbox"
              name="freeShipping"
              checked={product.freeShipping || false}
              onChange={handleInputChange}
              className="checkbox checkbox-primary"
              id="freeShipping"
            />
            <label htmlFor="freeShipping" className="label-text">{t("addproducts.freeShipping")}</label>
          </div>

          {/* Weight / Dimensions / CEP Origem */}
          <div className="py-2 grid grid-cols-2 gap-2">
            <input type="number" placeholder="Weight (kg)" name="weight" value={product.weight || ""} onChange={handleInputChange} className="input input-bordered" />
            <input type="number" placeholder="Length (cm)" name="length" value={product.length || ""} onChange={handleInputChange} className="input input-bordered" />
            <input type="number" placeholder="Width (cm)" name="width" value={product.width || ""} onChange={handleInputChange} className="input input-bordered" />
            <input type="number" placeholder="Height (cm)" name="height" value={product.height || ""} onChange={handleInputChange} className="input input-bordered" />
            <input type="text" placeholder="Origin ZIP" name="originZip" value={product.originZip || ""} onChange={handleInputChange} className="input input-bordered col-span-2" />
          </div>

          {/* Product Image */}
          <div className="py-2">
            <label className="label-text font-bold mb-2 block text-lg">{t("addproducts.productImage")}:</label>
            <input
              className="max-w-lg w-full"
              accept="image/*"
              type="file"
              name="image"
              onChange={handleImageChange}
            />
            {previewImage && <img src={previewImage} alt={t("addproducts.imagePreviewAlt")} className="my-2 max-w-xs border rounded" />}
            {product.imageURL && <input type="text" className="input input-sm input-bordered max-w-lg w-full my-2" value={product.imageURL} required placeholder={t("addproducts.imageUrl")} disabled />}
            <progress className="progress progress-primary w-44 md:w-72 xl:w-full" value={uploadProgress} max="100"></progress>
          </div>

          <button type="submit" className="btn btn-primary text-lg max-w-[200px] mt-2">
            {detectForm(paramsId, t("addproducts.addButton"), t("addproducts.updateButton"))}
          </button>
        </form>
      </main>
    </>
  );
};

export default AddProducts;
