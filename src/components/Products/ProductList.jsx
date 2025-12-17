import { useEffect, useState } from "react";
import { ListView, GridView, Search, ProductFilter, Pagination } from "../../components";
import { BsFillGridFill, BsFilter } from "react-icons/bs";
import { MdOutlineSubject } from "react-icons/md";
// Redux
import { filterBySearch, sortProducts } from "../../redux/slice/filterSlice";
import { useDispatch, useSelector } from "react-redux";
// i18n
import { useTranslation } from "react-i18next";

const ProductList = ({ products }) => {
  const { t } = useTranslation();
  const { filteredProducts } = useSelector((store) => store.filter);
  const [grid, setGrid] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(9);
  const [backToTop, setBackToTop] = useState(false);
  const dispatch = useDispatch();

  //! Search
  useEffect(() => {
    dispatch(filterBySearch({ products, search }));
  }, [dispatch, products, search]);

  //! Sort
  useEffect(() => {
    dispatch(sortProducts({ products, sort }));
  }, [dispatch, products, sort]);

  //! Scroll to top detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 400) {
        setBackToTop(true);
      } else {
        setBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // Pagination
  const indexOfLastProduct = currentPage * productPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <main className="relative">
      <header className="flex flex-col gap-y-4 xl:flex-row xl:items-center justify-between border-b pb-2">
        {/* Grid or List layout */}
        <div className="flex gap-2 items-center">
          <div className="flex gap-4">
            <BsFillGridFill
              size={28}
              onClick={() => setGrid(true)}
              className={`rounded-md p-1 ${grid ? "bg-neutral text-white" : ""}`}
            />
            <MdOutlineSubject
              size={28}
              onClick={() => setGrid(false)}
              className={`rounded-md p-1 ${grid ? "" : "bg-neutral text-white"}`}
            />
          </div>
          <h1>
            <span className="font-bold">{filteredProducts.length}</span> {t("productlist.products_found")}
          </h1>
        </div>

        {/* Search Bar */}
        <Search value={search} onChange={(e) => setSearch(e.target.value)} />

        {/* Sorting List */}
        <div className="flex gap-2 items-center">
          <label>{t("productlist.sort_by")}</label>
          <select
            value={sort}
            className="select select-sm select-bordered"
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="latest">{t("productlist.sort_latest")}</option>
            <option value="lowest-price">{t("productlist.sort_lowest_price")}</option>
            <option value="highest-price">{t("productlist.sort_highest_price")}</option>
            <option value="a2z">{t("productlist.sort_a2z")}</option>
            <option value="z2a">{t("productlist.sort_z2a")}</option>
          </select>
        </div>

        {/* Collapse for Filter */}
        <div className="collapse sm:hidden">
          <input type="checkbox" className="peer" />
          <div className="collapse-title rounded-sm bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content w-80 flex items-center justify-between">
            <p>{t("productlist.show_filters")}</p>
            <BsFilter size={28} />
          </div>
          <div className="collapse-content bg-primary text-primary-content peer-checked:bg-base-100 peer-checked:text-base-content w-80 border-2">
            <ProductFilter />
          </div>
        </div>
      </header>

      <section>
        {grid ? <GridView products={currentProducts} /> : <ListView products={currentProducts} />}
      </section>

      {backToTop && (
        <div className="fixed bottom-5 right-5">
          <button className="btn btn-primary sm:btn-lg rounded-full" onClick={scrollToTop}>
            &uarr; {t("productlist.back_to_top")}
          </button>
        </div>
      )}

      <Pagination
        productPerPage={productPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalProducts={filteredProducts.length}
      />
    </main>
  );
};

export default ProductList;
