// pages/checkout/success.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyOrder = async () => {
      const orderId = searchParams.get("orderId");
      if (!orderId) {
        setError("No order ID provided");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/orders/${orderId}/verify`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Verification failed");
        if (!data.order.isPaid && data.order.paymentMethod === "credit_card") {
          throw new Error("Payment not confirmed yet");
        }

        setOrder(data.order);
      } catch (err) {
        console.error("Order verification error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    verifyOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-lg">جاري تأكيد طلبك...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">حدث خطأ</h1>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button asChild>
          <Link href="/orders">الذهاب إلى طلباتي</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">شكراً لطلبك!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          تم تأكيد طلبك بنجاح وسيتم تجهيزه وشحنه في أقرب وقت ممكن.
          <br />
          رقم الطلب: <span className="font-bold">#{order.orderNumber}</span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="py-6 px-8 text-lg">
            <Link href="/orders">تتبع طلباتي</Link>
          </Button>
          <Button variant="outline" asChild className="py-6 px-8 text-lg">
            <Link href="/products">مواصلة التسوق</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
