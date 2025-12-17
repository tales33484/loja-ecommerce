import { useEffect, useState } from "react";
// Utilities
import { getUniqueValues } from "../../utils/uniqueValues";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { filterByCategory, filterByBrand, filterByprice } from "../../redux/slice/filterSlice";
import { formatPrice } from "../../utils/formatPrice";
// i18n
import { useTranslation } from "react-i18next";

const ProductFilter = () => {
	const { t } = useTranslation();
	const { products, minPrice, maxPrice } = useSelector((store) => store.product);
	const dispatch = useDispatch();

	const [category, setCategory] = useState("All");
	const [brand, setBrand] = useState("All");
	const [price, setPrice] = useState(maxPrice);

	const allCategories = getUniqueValues(products, "category");
	const allBrands = getUniqueValues(products, "brand");

	// Filter by category
	const filterProducts = (c) => {
		setCategory(c);
		dispatch(filterByCategory({ products, category: c }));
	};

	// Filter by brand
	useEffect(() => {
		dispatch(filterByBrand({ products, brand }));
	}, [dispatch, products, brand]);

	// Filter by price
	useEffect(() => {
		dispatch(filterByprice({ products, price }));
	}, [dispatch, products, price]);

	function clearFilter() {
		setCategory("All");
		setBrand("All");
		setPrice(maxPrice);
	}

	return (
		<div className="flex flex-col gap-y-5">
			{/* Categories */}
			<div>
				<h1 className="font-bold">{t("productfilter.categories")}</h1>
				<div className="flex flex-col gap-y-2 items-start">
					{allCategories.map((c, index) => (
						<button
							key={index}
							type="button"
							className={`w-full text-left ${
								category === c ? "border-l-4 border-primary px-2 font-semibold" : ""
							}`}
							onClick={() => filterProducts(c)}
						>
							{c === "All" ? t("productfilter.all_categories") : c}
						</button>
					))}
				</div>
			</div>

			{/* Brand */}
			<div>
				<h1 className="font-bold">{t("productfilter.brand")}</h1>
				<select
					className="select select-bordered w-full"
					name="brand"
					value={brand}
					onChange={(e) => setBrand(e.target.value)}
				>
					{allBrands.map((b, index) => (
						<option key={index} value={b}>
							{b === "All" ? t("productfilter.all_brands") : b}
						</option>
					))}
				</select>
			</div>

			{/* Price */}
			<div>
				<h1 className="font-bold">{t("productfilter.price")}</h1>
				<p>{formatPrice(price)}</p>
				<input
					className="range range-primary"
					type="range"
					value={price}
					min={minPrice}
					max={maxPrice}
					onChange={(e) => setPrice(e.target.value)}
				/>
			</div>

			{/* Clear Filters */}
			<div>
				<button className="btn btn-error" onClick={clearFilter}>
					{t("productfilter.clear_filters")}
				</button>
			</div>
		</div>
	);
};

export default ProductFilter;
