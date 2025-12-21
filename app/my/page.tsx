'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

type GroupItem = {
  group: any;
  hasPaid: boolean;
};

export default function MyGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupItem[]>([]);
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
        <div
          key={group.id}
          style={{
            border: '1px solid #ddd',
            padding: 16,
            marginBottom: 16,
            borderRadius: 8,
          }}
        >
          <h3>{group.product.name}</h3>
          <p>👥 {group.members.length} / {group.target}</p>

          <h4>סטטוס תשלומים:</h4>
          <ul>
            {group.members.map((m: any) => {
              const paid = group.payments.some(
                (p: any) => p.userId === m.userId
              );

              return (
                <li key={m.userId}>
                  {m.user.username || m.user.email} —{' '}
                  {paid ? '✅ שילם' : '⏳ ממתין'}
                </li>
              );
            })}
          </ul>

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
              🎉 כולם שילמו – הקבוצה הושלמה
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
