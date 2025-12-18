'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function PayPage({ params }: any) {
  const router = useRouter();
  const groupId = Number(params.groupId);

  return (
    <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
      <h1>💳 תשלום קבוצתי</h1>

      <PayPalButtons
        createOrder={async () => {
          const res = await apiFetch('/payments/paypal/create', {
            method: 'POST',
            body: JSON.stringify({ groupId }),
          });

          return res.id; // PayPal Order ID
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
