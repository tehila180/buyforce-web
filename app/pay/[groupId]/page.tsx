'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function PayPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: '0 auto' }}>
      <h1>💳 תשלום קבוצתי</h1>

      <PayPalButtons
        createOrder={async () => {
          const res = await apiFetch('/payments/paypal/create', {
            method: 'POST',
            body: JSON.stringify({ groupId: Number(groupId) }),
          });

          return res.id; // PayPal orderId
        }}

        onApprove={async (data) => {
          await apiFetch(
            `/payments/paypal/capture?token=${data.orderID}`,
            { method: 'POST' },
          );

          router.push('/payment/success');
        }}
      />
    </div>
  );
}
