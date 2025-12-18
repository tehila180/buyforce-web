'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function PayPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <h2>תשלום</h2>

      <PayPalButtons
        createOrder={async () => {
          const res = await apiFetch('/payments/paypal/create', {
            method: 'POST',
            body: JSON.stringify({ groupId: Number(groupId) }),
          });

          return res.id; // PayPal orderId
        }}
        onApprove={async (data) => {
          await apiFetch('/payments/paypal/capture', {
            method: 'POST',
            body: JSON.stringify({ orderId: data.orderID }),
          });

          router.push('/payment/success');
        }}
      />
    </div>
  );
}
