import hero from "../../assets/hero3.png";
import { Link } from "react-router-dom";
import { TbArrowNarrowRight } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

let currentIndex = 0;

const Hero = () => {
  const { t } = useTranslation();

  // Pegando tags do JSON
  const tags = t("hero.tags", { returnObjects: true });

  const [tagName, setTagName] = useState("");

  function updateCountdown() {
    const currentItem = tags[currentIndex];
    setTagName(currentItem);
    currentIndex = (currentIndex + 1) % tags.length;
    setTimeout(updateCountdown, 2000);
  }

  useEffect(() => {
    updateCountdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="bg-base-100 w-full md:w-9/12 min-h-[92vh] mx-auto flex flex-col items-start justify-center">
      <div className="container px-6 py-16 mx-auto">
        <div className="items-center lg:flex">
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-lg">
              <p className="text-4xl font-bold lg:text-4xl">
                {t("hero.slogan1")}{" "}
                <span className="text-blue-500 opacity-100 transition-opacity duration-2000">
                  {tagName}
                </span>
              </p>

              <p className="mt-3 text-gray-600 dark:text-gray-400">
                {t("hero.slogan2")}
              </p>

              <Link to="/all">
                <button className="w-full px-5 py-2 mt-6 text-sm tracking-wider text-white uppercase transition-colors duration-300 transform bg-blue-600 rounded-lg lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500 flex items-center gap-2">
                  {t("hero.shop_now")} <TbArrowNarrowRight />
                </button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center w-full mt-6 lg:mt-0 lg:w-1/2">
            <img
              className="w-full h-full lg:max-w-3xl"
              src="https://res.cloudinary.com/db1yaqt97/image/upload/v1765770958/1_rko1ku.png"
              alt="Catalogue"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
