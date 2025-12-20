'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

// ---------- Types ----------

type Member = {
  id: number;
  user: {
    id: string;
    username: string;
    email: string;
  };
};

type Group = {
  id: number;
  status: 'open' | 'completed' | 'paid';
  target: number;
  members: Member[];
  product: {
    id: number;
    name: string;
    priceRegular: number;
    priceGroup: number;
  };
};

// ---------- Helpers ----------

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

function getCurrentUserId() {
  try {
    const token = getToken();
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub as string;
  } catch {
    return null;
  }
}

// ---------- Page ----------

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = getToken();
  const currentUserId = getCurrentUserId();

  async function loadGroup() {
    try {
      setError(null);
      setLoading(true);

      if (!token) {
        setError('כדי לצפות בדף הקבוצה עליך להתחבר למערכת.');
        setGroup(null);
        return;
      }

      const data = await apiFetch(`/groups/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroup(data);
    } catch (err: any) {
      setError(err.message || 'שגיאה בטעינת הקבוצה');
      setGroup(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) loadGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isMember = group
    ? group.members.some((m) => m.user.id === currentUserId)
    : false;

  async function handleJoin() {
    if (!group) return;

    if (!token) {
      alert('כדי להצטרף לקבוצה עליך להתחבר או להירשם.');
      return;
    }

    if (isMember) {
      alert('את כבר מצטרפת לקבוצה הזו 🙂');
      return;
    }

    try {
      await apiFetch(`/groups/${group.id}/join`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('הצטרפת לקבוצה!');
      await loadGroup();
    } catch (err: any) {
      alert(err.message || 'שגיאה בהצטרפות לקבוצה');
    }
  }

  // ---------- Render ----------

  if (loading) return <p style={{ padding: 24 }}>טוען קבוצה...</p>;

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>
        {!token && (
          <button onClick={() => router.push('/login')}>
            התחברות
          </button>
        )}
      </div>
    );
  }

  if (!group) return <p style={{ padding: 24 }}>הקבוצה לא נמצאה</p>;

  const percent = Math.min(
    100,
    Math.round((group.members.length / group.target) * 100),
  );

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>
        קבוצה למוצר: {group.product.name}
      </h1>

      <p>
        מחיר קבוצתי: <strong>₪{group.product.priceGroup}</strong>
      </p>
      <p>
        מחיר רגיל:{' '}
        <span style={{ textDecoration: 'line-through' }}>
          ₪{group.product.priceRegular}
        </span>
      </p>

      <div style={{ margin: '16px 0' }}>
        👥 חברים: {group.members.length} / {group.target}
        <div
          style={{
            background: '#eee',
            height: 10,
            borderRadius: 999,
            overflow: 'hidden',
            marginTop: 8,
          }}
        >
          <div
            style={{
              width: `${percent}%`,
              height: '100%',
              background: '#4f46e5',
            }}
          />
        </div>
      </div>

      {/* כפתורי פעולה */}
      {group.status === 'open' && (
        isMember ? (
          <p style={{ color: 'green' }}>
            ✅ את כבר בקבוצה. מחכים לעוד חברים…
          </p>
        ) : (
          <button onClick={handleJoin}>
            הצטרפות לקבוצה
          </button>
        )
      )}

      {group.status === 'completed' && isMember && (
        <button
          onClick={() => router.push(`/pay/[groupId]/${group.id}`)}
          style={{
            marginTop: 16,
            padding: '10px 18px',
            borderRadius: 999,
            border: 'none',
            background: '#16a34a',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          💳 המשך לתשלום
        </button>
      )}

      {group.status === 'paid' && isMember && (
        <p style={{ color: 'green', marginTop: 16 }}>
          ✅ התשלום הושלם. תודה!
        </p>
      )}
    </div>
  );
}
