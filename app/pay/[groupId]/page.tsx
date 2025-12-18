'use client';

import PayPalProvider from '@/components/PayPalProvider';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { apiFetch } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function PayPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  return (
    <PayPalProvider>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: 24 }}>
        <h1>💳 תשלום</h1>

        <PayPalButtons
          createOrder={async () => {
            const res = await apiFetch('/payments/paypal/create', {
              method: 'POST',
              body: JSON.stringify({ groupId: Number(groupId) }),
            });
            return res.id;
          }}
          onApprove={async (data) => {
            await apiFetch(`/payments/paypal/capture?token=${data.orderID}`);
            router.push('/payment/success');
          }}
        />
      </div>
    </PayPalProvider>
  );
}
