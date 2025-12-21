'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function MyGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/groups/my')
      .then(setGroups)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>טוען…</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>האזור האישי שלי</h1>

      {groups.map(({ group, hasPaid }) => (
        <div key={group.id} style={{ border: '1px solid #ddd', padding: 16, marginBottom: 16 }}>
          <h3>{group.product.name}</h3>

          {!hasPaid && group.status === 'completed' && (
            <button onClick={() => router.push(`/pay/${group.id}`)}>
              💳 המשך לתשלום
            </button>
          )}

          {hasPaid && group.status !== 'paid' && (
            <p style={{ color: 'green' }}>
              ✅ שילמת – ממתינים לשאר המשתתפים
            </p>
          )}

          {group.status === 'paid' && (
            <p style={{ color: 'green', fontWeight: 'bold' }}>
              🎉 כולם שילמו
            </p>
          )}

          {group.status === 'cancelled' && (
            <p style={{ color: 'red' }}>
              💸 הקבוצה בוטלה – התשלום הוחזר
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
