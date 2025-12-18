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
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) return router.push('/login');

      const data = await apiFetch(`/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGroup(data);
      setLoading(false);
    })();
  }, [groupId, router]);

  if (loading) return <p style={{ padding: 24 }}>טוען תשלום...</p>;
  if (!group) return <p style={{ padding: 24 }}>קבוצה לא נמצאה</p>;

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: '0 auto' }}>
      <h1>💳 תשלום קבוצתי</h1>

      <p><strong>מוצר:</strong> {group.product.name}</p>
      <p><strong>מחיר לתשלום:</strong> ₪{(group.product.priceGroup / 100).toFixed(2)}</p>
      <p>חברים בקבוצה: {group.members.length} / {group.target}</p>

      <div style={{ marginTop: 16 }}>
        <PayPalButtons
          style={{ layout: 'vertical' }}
          createOrder={async () => {
            const token = localStorage.getItem('token');
            const res = await apiFetch('/payments/paypal/create', {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}` },
              body: JSON.stringify({ groupId: Number(groupId) }),
            });
            return res.id; // חייב להיות orderId
          }}
          onApprove={async (data) => {
            const token = localStorage.getItem('token');
            await apiFetch(`/payments/paypal/capture?token=${data.orderID}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            router.push('/payment/success');
          }}
          onError={(err) => {
            console.error(err);
            alert('שגיאה ב-PayPal');
          }}
        />
      </div>
    </div>
  );
}
