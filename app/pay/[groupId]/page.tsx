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

        // 🔹 יצירת הזמנה דרך ה-SDK (פותח חלון PayPal)
        createOrder={(data, actions) => {
          return actions.order.create({
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

        // 🔹 מתבצע רק אחרי אישור תשלום אמיתי
        onApprove={async (data, actions) => {
          if (!actions.order) return;

          // ⬅️ כאן PayPal מבצע Capture אמיתי
          const details = await actions.order.capture();

          // ⬅️ עדכון השרת שלך בלבד (DB)
          await apiFetch('/payments/paypal/confirm', {
            method: 'POST',
            body: JSON.stringify({
              groupId: Number(groupId),
              paypalOrderId: details.id,
            }),
          });

          router.push('/payment/success');
        }}

        onError={(err) => {
          console.error('PayPal error:', err);
          router.push('/payment/fail');
        }}
      />
    </div>
  );
}
