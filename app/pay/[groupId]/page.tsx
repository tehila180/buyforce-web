'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function PayPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 16 }}>💳 תשלום השתתפות</h1>

      <p style={{ marginBottom: 24 }}>
        דמי הצטרפות לקבוצה: <strong>₪1</strong>
      </p>

      <PayPalButtons
        style={{ layout: 'vertical' }}

        createOrder={(data, actions) => {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'ILS',
                  value: '1.00',
                },
              },
            ],
          });
        }}

        onApprove={async (data, actions) => {
          if (!actions.order) return;

          try {
            // 1️⃣ Capture אמיתי מול PayPal
            await actions.order.capture();

            // 2️⃣ עדכון הבקן + DB
            await apiFetch(
              `/payments/paypal/capture?token=${data.orderID}`,
              { method: 'POST' }
            );

            // 3️⃣ ניווט רק אחרי הצלחה
            router.push('/payment/success');
          } catch (err) {
            console.error('Payment failed:', err);
            alert('❌ התשלום נכשל, נסי שוב');
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
