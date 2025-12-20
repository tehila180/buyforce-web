'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function PayPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

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

          // 1️⃣ Capture אמיתי מול PayPal
          const details = await actions.order.capture();

          // 2️⃣ עדכון ה-Backend (DB)
          await apiFetch('/payments/paypal/confirm', {
            method: 'POST',
            body: JSON.stringify({
              groupId: Number(groupId),
              paypalOrderId: details.id,
            }),
          });

          // 3️⃣ ניווט לדף קיים בלבד
          router.push('/payment/success');
        }}

        onError={() => {
          router.push('/payment/fail');
        }}
      />
    </div>
  );
}
