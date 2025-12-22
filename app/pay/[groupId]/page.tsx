'use client';

import { PayPalButtons } from '@paypal/react-paypal-js';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function JoinPayPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  return (
    <div style={{ padding: 24 }}>
      <h1>💳 הצטרפות לקבוצה</h1>
      <p>דמי השתתפות: ₪1</p>

      <PayPalButtons
        createOrder={(data, actions) =>
          actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: { currency_code: 'ILS', value: '1.00' },
              },
            ],
          })
        }
        onApprove={async (data, actions) => {
          if (!actions.order) return;

          const details = await actions.order.capture();

          await apiFetch('/payments/paypal/join', {
            method: 'POST',
            body: JSON.stringify({
              groupId: Number(groupId),
              paypalOrderId: details.id,
            }),
          });

          router.push(`/groups/${groupId}`);
        }}
      />
    </div>
  );
}
