"use client";

import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/lib/redux/slices/cartSlice";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/lib/use-translation";
export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useTranslation();
  const handleAddToCart = () => {
    setIsAdding(true);
    dispatch(
      addToCart({
        _id: product._id, // FIX: must match your slice
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug, // extra fields are fine
      })
    );
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg dark:bg-gray-800">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <h1>no image</h1>
          )}
          {product.discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {product.discount}% OFF
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {t("price_prefix")}
              {product.price}
            </span>
            {product.discount > 0 && (
              <span className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
                {t("price_prefix")}
                {(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {product.rating || "No ratings"}
            </span>
          </div>
        </div>

        <div className="mt-4 flex space-x-2">
          <Button
            variant="outline"
            className="flex-1 border border-gray-300 dark:border-gray-600"
            asChild
          >
            <Link href={`/products/${product._id}`}>View Details</Link>
          </Button>
          <Button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {isAdding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
