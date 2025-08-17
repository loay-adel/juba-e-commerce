import { useSelector, useDispatch } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/lib/redux/slices/wishlistSlice";
import { useTranslation } from "@/lib/use-translation";
import Link from "next/link";

const Wishlist = () => {
  const { t } = useTranslation();
  const { items } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">
          {t("wishlist.title")}
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              {t("wishlist.empty")}
            </p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
            >
              {t("actions.back_to_products")}
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-gray-600 dark:text-gray-400">
              {items.length} {t("wishlist.items")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {t("product.price_prefix")} {product.price}
                    </p>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded transition"
                      >
                        {t("wishlist.remove")}
                      </button>

                      <Link
                        href={`/product/${product.id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center transition"
                      >
                        {t("product.view_details")}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Wishlist;
