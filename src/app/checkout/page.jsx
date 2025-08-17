"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "@/lib/redux/slices/cartSlice";
import { useTranslation } from "@/lib/use-translation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { t, currentLanguage, isRTL } = useTranslation();
  const router = useRouter();
  const dispatch = useDispatch();

  // Cart data
  const cartItems = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);

  // Fixed shipping cost of 70 EGP
  const shippingCost = 70;
  const total = subtotal + shippingCost;

  // Form handling
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      paymentMethod: "cashOnDelivery",
    },
  });

  const paymentMethod = watch("paymentMethod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const userToken = useSelector((state) => state.auth.token);
  //  the onSubmit function
  // In CheckoutPage.jsx
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Create order in local database first
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: "current-user-id", // You need to include the user ID here
            orderItems: cartItems.map((item) => ({
              product: item._id, // Include product ID
              name: item.name,
              image: item.image,
              price: item.price,
              qty: item.quantity, // Make sure this matches your schema
            })),
            shippingAddress: {
              address: data.address,
              city: data.city,
              postalCode: data.zip,
              country: "Egypt",
            },
            paymentMethod: data.paymentMethod,
            subtotal,
            shippingCost,
            totalPrice: total,
            status: "pending",
          }),
        }
      );

      if (!orderRes.ok) throw new Error("Failed to create order");
      const newOrder = await orderRes.json();

      // For credit card payments
      if (data.paymentMethod === "creditCard") {
        // Save order ID in localStorage as fallback
        localStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            orderId: newOrder._id,
            timestamp: Date.now(),
          })
        );

        const paymentRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create-payment`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: total,
              orderId: newOrder._id,
              userId: "current-user-id", // Replace with actual user ID
              items: cartItems.map((item) => ({
                name: item.name.substring(0, 50),
                description:
                  item.description?.substring(0, 100) ||
                  item.name.substring(0, 100),
                price: item.price,
                quantity: item.quantity,
                productId: item._id, // Include product ID
              })),
              customer: {
                first_name: data.firstName.substring(0, 30),
                last_name: data.lastName.substring(0, 30),
                email: data.email,
                phone_number: data.phone.startsWith("+20")
                  ? data.phone
                  : `+20${data.phone.replace(/^0/, "")}`,
              },
              shipping_address: {
                street: data.address.substring(0, 100),
                city: data.city.substring(0, 30),
                state: data.state?.substring(0, 30) || "Cairo",
                postal_code: data.zip || "00000",
                country: "EGY",
                apartment: "NA",
                floor: "NA",
                building: "NA",
              },
            }),
          }
        );

        const result = await paymentRes.json();

        if (!paymentRes.ok || !result.paymentUrl) {
          throw new Error(result.error || "Payment processing failed");
        }

        // Open payment in new tab with fallback handling
        const paymentWindow = window.open("", "_blank");
        paymentWindow.location.href = result.paymentUrl;

        // Poll for payment completion
        const checkPayment = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/orders/${newOrder._id}/status`);
            const status = await statusRes.json();

            if (status.isPaid) {
              clearInterval(checkPayment);
              paymentWindow.close();
              dispatch(clearCart());
              localStorage.removeItem("pendingOrder");
              router.push(`/checkout/success?orderId=${newOrder._id}`);
            }
          } catch (error) {
            console.error("Status check failed:", error);
          }
        }, 3000); // Check every 3 seconds

        return;
      }

      // For cash on delivery
      dispatch(clearCart());
      router.push(`/checkout/success?orderId=${newOrder._id}`);
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">{t("cart.empty")}</h1>
        <Button onClick={() => router.push("/products")}>
          {t("cart.continue_shopping")}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t("checkout.title")}</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Shipping Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="text-xl font-bold">
              {t("checkout.shipping_info")}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block mb-2 font-medium">
                    {t("checkout.first_name")}
                  </label>
                  <Input
                    id="firstName"
                    {...register("firstName", {
                      required: t("validation.required"),
                    })}
                    className={errors.firstName && "border-red-500"}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="lastName" className="block mb-2 font-medium">
                    {t("checkout.last_name")}
                  </label>
                  <Input
                    id="lastName"
                    {...register("lastName", {
                      required: t("validation.required"),
                    })}
                    className={errors.lastName && "border-red-500"}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  {t("checkout.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: t("validation.required"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("validation.invalid_email"),
                    },
                  })}
                  className={errors.email && "border-red-500"}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block mb-2 font-medium">
                  {t("checkout.phone")}
                </label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone", {
                    required: t("validation.required"),
                    pattern: {
                      value: /^(\+20|0)?1[0-9]{9}$/,
                      message: t("validation.invalid_phone"),
                    },
                  })}
                  className={errors.phone && "border-red-500"}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block mb-2 font-medium">
                  {t("checkout.address")}
                </label>
                <Textarea
                  id="address"
                  rows={3}
                  {...register("address", {
                    required: t("validation.required"),
                  })}
                  className={errors.address && "border-red-500"}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block mb-2 font-medium">
                    {t("checkout.city")}
                  </label>

                  <select
                    id="city"
                    {...register("city", {
                      required: t("validation.required"),
                    })}
                    className={`w-full p-2 border rounded-md ${
                      errors.city && "border-red-500"
                    }`}
                  >
                    <option value="">{t("checkout.select_city")}</option>
                    <option value="Cairo">Cairo</option>
                    <option value="Alexandria">Alexandria</option>
                    <option value="Giza">Giza</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="state" className="block mb-2 font-medium">
                    {t("checkout.state")}
                  </label>
                  <Input
                    id="state"
                    {...register("state", {
                      required: t("validation.required"),
                    })}
                    className={errors.state && "border-red-500"}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="zip" className="block mb-2 font-medium">
                    {t("checkout.zip")}
                  </label>
                  <Input
                    id="zip"
                    {...register("zip", {
                      required: t("validation.required"),
                      pattern: {
                        value: /^[0-9]{5}$/,
                        message: t("validation.invalid_zip"),
                      },
                    })}
                    className={errors.zip && "border-red-500"}
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.zip.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader className="text-xl font-bold">
              {t("checkout.payment_method")}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <input
                    type="radio"
                    id="creditCard"
                    value="creditCard"
                    {...register("paymentMethod")}
                    className="h-5 w-5"
                  />
                  <label htmlFor="creditCard" className="font-medium flex-1">
                    <div>{t("checkout.credit_card")}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {t("checkout.credit_card_description")}
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 border rounded-lg">
                  <input
                    type="radio"
                    id="cashOnDelivery"
                    value="cashOnDelivery"
                    {...register("paymentMethod")}
                    className="h-5 w-5"
                  />
                  <label
                    htmlFor="cashOnDelivery"
                    className="font-medium flex-1"
                  >
                    <div>{t("checkout.cash_on_delivery")}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {t("checkout.cash_on_delivery_description")}
                    </div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader className="text-xl font-bold">
              {t("checkout.order_summary")}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <span className="truncate max-w-[180px]">
                        {item.name}{" "}
                        <span className="text-gray-500">× {item.quantity}</span>
                      </span>
                      <span className="whitespace-nowrap">
                        {t("price", { value: item.price * item.quantity })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between">
                    <span>{t("checkout.subtotal")}</span>
                    <span>{t("price", { value: subtotal })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("checkout.shipping")}</span>
                    <span>{t("price", { value: shippingCost })}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>{t("checkout.total")}</span>
                    <span>{t("price", { value: total })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full py-6 text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("checkout.processing")}
                  </>
                ) : (
                  t("checkout.place_order")
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
