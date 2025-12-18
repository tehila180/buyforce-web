'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { apiFetch } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';

export default function PayPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  return (
    <div style={{ padding: 24 }}>
      <h1>💳 תשלום</h1>

      <PayPalButtons
        createOrder={async () => {
          const res = await apiFetch('/payments/paypal/create', {
            method: 'POST',
            body: JSON.stringify({ groupId: Number(groupId) }),
          });

          return res.id; // PayPal orderId
        }}
        onApprove={async (data) => {
          await apiFetch(`/payments/paypal/capture?token=${data.orderID}`);
          router.push('/payment/success');
        }}
      />
    </div>
  );
}
