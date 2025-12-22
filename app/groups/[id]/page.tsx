'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/groups/${id}`)
      .then(setGroup)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>טוען…</p>;
  if (!group) return <p>קבוצה לא נמצאה</p>;

  const paidUserIds = new Set(
    group.payments
      ?.filter((p: any) => p.status === 'CAPTURED')
      .map((p: any) => p.userId)
  );

  return (
    <div style={{ padding: 24 }}>
      <h1>{group.product.name}</h1>

      <p>👥 {group.members.length} / {group.target}</p>

      <h3>משתתפים</h3>
      <ul>
        {group.members.map((m: any) => (
          <li key={m.user.id}>
            {m.user.username || m.user.email}
            {m.user.id === group.currentUserId && ' (אני)'} —{' '}
            {paidUserIds.has(m.user.id) ? '✅ שילם' : '⏳ ממתין'}
          </li>
        ))}
      </ul>

      {group.status === 'completed' && !group.hasPaid && (
        <button onClick={() => router.push(`/pay/${group.id}`)}>
          💳 המשך לתשלום
        </button>
      )}

      {group.hasPaid && group.status !== 'paid' && (
        <p style={{ color: 'green' }}>
          ✅ שילמת – ממתינים לשאר המשתתפים
        </p>
      )}

      {group.status === 'paid' && (
        <p style={{ color: 'green', fontWeight: 'bold' }}>
          🎉 כולם שילמו!
        </p>
      )}

      {group.status === 'cancelled' && (
        <p style={{ color: 'red', fontWeight: 'bold' }}>
          ❌ הקבוצה בוטלה – התשלום הוחזר
        </p>
      )}
    </div>
  );
}
