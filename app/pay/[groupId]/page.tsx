'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function PayPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: '0 auto' }}>
      <h1>💳 תשלום השתתפות</h1>

      <PayPalButtons
        createOrder={(data, actions) =>
          actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'ILS',
                  value: '1.00',
                },
              },
            ],
          })
        }
        onApprove={async (data, actions) => {
          if (!actions.order) return;

          try {
            await actions.order.capture();

            await apiFetch('/payments/paypal/confirm', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                groupId: Number(groupId),
                paypalOrderId: data.orderID,
              }),
            });

            router.push('/payment/success');
          } catch (err) {
            console.error(err);
            alert('❌ התשלום נכשל');
            router.push('/payment/fail');
          }
        }}
      />
    </div>
  );
}
