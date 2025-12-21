'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

type Member = {
  user: {
    id: string;
    username: string;
    email: string;
  };
};

type Payment = {
  userId: string;
  status: string;
};

type Group = {
  id: number;
  status: 'open' | 'completed' | 'paid';
  target: number;
  members: Member[];
  payments: Payment[];
  hasPaid: boolean;
  product: {
    name: string;
    priceRegular: number;
    priceGroup: number;
  };
};

function getUserId() {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch {
    return null;
  }
}

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUserId = getUserId();

  useEffect(() => {
    apiFetch(`/groups/${id}`)
      .then(setGroup)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: 24 }}>טוען קבוצה…</p>;
  if (!group) return <p style={{ padding: 24 }}>קבוצה לא נמצאה</p>;

  const paidUserIds = new Set(
    group.payments
      .filter(p => p.status === 'CAPTURED')
      .map(p => p.userId)
  );

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1>{group.product.name}</h1>

      <p>
        מחיר קבוצתי: <strong>₪{group.product.priceGroup}</strong>
      </p>
      <p style={{ textDecoration: 'line-through', color: '#888' }}>
        ₪{group.product.priceRegular}
      </p>

      <p>
        👥 {group.members.length} / {group.target}
      </p>

      {/* 👥 רשימת משתתפים */}
      <h3 style={{ marginTop: 20 }}>משתתפים</h3>
      <ul>
        {group.members.map(m => (
          <li key={m.user.id}>
            {m.user.username || m.user.email} —{' '}
            {paidUserIds.has(m.user.id) ? '✅ שילם' : '⏳ ממתין'}
          </li>
        ))}
      </ul>

      {/* 💳 כפתורי פעולה */}
      {group.status === 'completed' && !group.hasPaid && (
        <button
          onClick={() => router.push(`/pay/${group.id}`)}
          style={{ marginTop: 16 }}
        >
          💳 המשך לתשלום
        </button>
      )}

      {group.hasPaid && group.status !== 'paid' && (
        <p style={{ color: 'green', marginTop: 16 }}>
          ✅ שילמת – ממתינים לשאר המשתתפים
        </p>
      )}

      {group.status === 'paid' && (
        <p style={{ color: 'green', fontWeight: 'bold', marginTop: 16 }}>
          🎉 כולם שילמו!
        </p>
      )}
    </div>
  );
}
