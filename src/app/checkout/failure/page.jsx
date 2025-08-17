'use client';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function FailurePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <div className="max-w-md mx-auto">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Payment Failed</h1>
        <p className="text-lg mb-8">
          We couldn't process your payment. Please try again.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Checkout
          </Button>
          <Button onClick={() => router.push('/cart')}>
            View Cart
          </Button>
        </div>
      </div>
    </div>
  );
}