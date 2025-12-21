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
    </div>
  );
}
