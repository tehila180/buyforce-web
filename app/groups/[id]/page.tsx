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

  return (
    <div style={{ padding: 24 }}>
      <h1>{group.product.name}</h1>

      <h3>משתתפים</h3>
      <ul>
        {group.members.map((m: any) => (
          <li key={m.user.id}>
            {m.user.username || m.user.email} —{' '}
            {group.paidUserIds.includes(m.user.id)
              ? '✅ שילם'
              : '⏳ ממתין'}
          </li>
        ))}
      </ul>

      {!group.hasPaid && group.status === 'completed' && (
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
    </div>
  );
}
