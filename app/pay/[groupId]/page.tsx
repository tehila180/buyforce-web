'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { apiFetch } from '@/lib/api';

export default function PayPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();

  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch(`/groups/${groupId}`);
        setGroup(data);
      } catch {
        alert('שגיאה בטעינת הקבוצה');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [groupId]);

  if (loading) return <p style={{ padding: 24 }}>טוען...</p>;
  if (!group) return <p style={{ padding: 24 }}>קבוצה לא נמצאה</p>;

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: '0 auto' }}>
      <h1>💳 תשלום קבוצתי</h1>

      <p><strong>מוצר:</strong> {group.product.name}</p>
      <p><strong>מחיר:</strong> ₪{group.product.priceGroup}</p>
      <p>חברים בקבוצה: {group.members.length}</p>

      <PayPalButtons
        style={{ layout: 'vertical' }}

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

        onError={() => {
          router.push('/payment/success/fail');
        }}
      />
    </div>
  );
}
