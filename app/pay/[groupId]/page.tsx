'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function PayPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: '0 auto' }}>
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
            // 1️⃣ Capture מול PayPal
            const details = await actions.order.capture();

            // 2️⃣ עדכון Backend
            await apiFetch('/payments/paypal/confirm', {
              method: 'POST',
              body: JSON.stringify({
                groupId: Number(groupId),
                paypalOrderId: details.id,
              }),
            });

            // 3️⃣ מעבר לדף קיים בלבד
            router.push('/payment/success');

          } catch (err: any) {
            console.error('❌ Payment confirm failed:', err.message);
            alert('התשלום בוצע אך שמירתו נכשלה');
            router.push('/payment/fail');
          }
        }}

        onError={(err) => {
          console.error('PayPal error:', err);
          router.push('/payment/fail');
        }}
      />
    </div>
  );
}
