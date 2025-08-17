"use client";

import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProducts } from "@/lib/redux/slices/productSlice";
import Link from "next/link";
import { useTranslation } from "@/lib/use-translation";
import { cn } from "@/lib/utils";

export default function Home() {
  const { t, currentLanguage } = useTranslation();
  const dispatch = useDispatch();
  const {
    items: products,
    status,
    error,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto dark:border-indigo-400"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-500 text-lg dark:text-red-400">
            {error || t("errors.fetch_products")}
          </p>
          <Button
            onClick={() => dispatch(fetchProducts())}
            className="mt-4"
            variant="outline"
          >
            {t("actions.try_again")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background dark:bg-gray-900"
      dir={currentLanguage === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-20 dark:from-blue-800 dark:to-indigo-900">
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "max-w-2xl",
              currentLanguage === "ar" ? "text-right" : "text-left"
            )}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {t("home.hero.title")}
            </h1>
            <p className="text-xl mb-8">{t("home.hero.subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-white text-indigo-700 hover:bg-gray-100 dark:bg-gray-100 dark:hover:bg-gray-200"
                asChild
              >
                <Link href="/categories">{t("home.hero.browse_products")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "flex flex-col md:flex-row justify-between items-center mb-10",
              currentLanguage === "ar" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={currentLanguage === "ar" ? "text-right" : "text-left"}
            >
              <h2 className="text-3xl font-bold dark:text-white">
                {t("home.featured.title")}
              </h2>
              <p className="text-gray-600 mt-2 dark:text-gray-400">
                {t("home.featured.subtitle")}
              </p>
            </div>
            <Button
              variant="link"
              className="text-lg dark:text-gray-300"
              asChild
            >
              <Link href="/products">{t("home.featured.view_all")}</Link>
            </Button>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {t("home.featured.no_products")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* RTL-Compatible Crazy Auto-Scroller */}
      <section className="py-16 bg-black overflow-hidden">
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "mb-12",
              currentLanguage === "ar" ? "text-right" : "text-left"
            )}
          >
            <h2 className="text-4xl font-bold mb-4 text-white">
              {t("home.categories.title")}
            </h2>
            <p className="text-gray-400">{t("home.categories.subtitle")}</p>
          </div>

          {products.length > 0 ? (
            <div className="relative">
              {/* Slider Track */}
              <div className="flex overflow-x-hidden group">
                <div
                  className="flex animate-scroll hover:animation-pause"
                  dir={currentLanguage === "ar" ? "rtl" : "ltr"} // Dynamic direction
                >
                  {[...new Set(products.map((p) => p.category))].map(
                    (category) => (
                      <Link
                        key={category}
                        href={`/category/${category.toLowerCase()}`}
                        className="flex-shrink-0 w-64 mx-2 p-6 bg-gray-900 border border-gray-800 hover:border-purple-500 transition-all duration-300 relative"
                      >
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-500">
                          {category}
                        </h3>
                        <p className="text-gray-400 font-mono">
                          {
                            products.filter((p) => p.category === category)
                              .length
                          }{" "}
                          {t("home.categories.products")}
                        </p>
                      </Link>
                    )
                  )}
                  {/* Mirror clone for seamless loop */}
                  {[...new Set(products.map((p) => p.category))].map(
                    (category) => (
                      <Link
                        key={`${category}-clone`}
                        href={`/category/${category.toLowerCase()}`}
                        className="flex-shrink-0 w-64 mx-2 p-6 bg-gray-900 border border-gray-800 hover:border-purple-500 transition-all duration-300"
                        aria-hidden="true"
                      >
                        <h3 className="text-xl font-bold text-white mb-2">
                          {category}
                        </h3>
                        <p className="text-gray-400 font-mono">
                          {
                            products.filter((p) => p.category === category)
                              .length
                          }{" "}
                          {t("home.categories.products")}
                        </p>
                      </Link>
                    )
                  )}
                </div>
              </div>

              {/* Gradient Fades (Direction-Aware) */}
              <div
                className={cn(
                  "absolute top-0 w-24 h-full z-10 pointer-events-none",
                  currentLanguage === "ar"
                    ? "right-0 bg-gradient-to-l from-black to-transparent"
                    : "left-0 bg-gradient-to-r from-black to-transparent"
                )}
              ></div>
              <div
                className={cn(
                  "absolute top-0 w-24 h-full z-10 pointer-events-none",
                  currentLanguage === "ar"
                    ? "left-0 bg-gradient-to-r from-black to-transparent"
                    : "right-0 bg-gradient-to-l from-black to-transparent"
                )}
              ></div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t("home.categories.no_categories")}</p>
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-background dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "flex flex-col md:flex-row justify-between items-center mb-10",
              currentLanguage === "ar" ? "flex-row-reverse" : ""
            )}
          >
            <div
              className={currentLanguage === "ar" ? "text-right" : "text-left"}
            >
              <h2 className="text-3xl font-bold dark:text-white">
                {t("home.new_arrivals.title")}
              </h2>
              <p className="text-gray-600 mt-2 dark:text-gray-400">
                {t("home.new_arrivals.subtitle")}
              </p>
            </div>
            <Button
              variant="link"
              className="text-lg dark:text-gray-300"
              asChild
            >
              <Link href="/categories">{t("home.new_arrivals.view_all")}</Link>
            </Button>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(-8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {t("home.new_arrivals.no_products")}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
