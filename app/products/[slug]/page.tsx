'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    apiFetch(`/products/${slug}`).then(setProduct);
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    apiFetch(`/groups/product/${product.id}`).then(setGroups);
  }, [product]);

  if (!product) return <p>טוען…</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>{product.name}</h1>

      <h2>קבוצות פעילות</h2>

      {groups.map(group => (
        <div key={group.id} style={{ border: '1px solid #ddd', padding: 16, marginBottom: 12 }}>
          <p>👥 {group.members.length} / {group.target}</p>

          {group.status === 'open' ? (
            <button
              onClick={() => router.push(`/pay/join/${group.id}`)}
            >
              💳 הצטרפות לקבוצה – ₪1
            </button>
          ) : (
            <p>🔒 קבוצה סגורה</p>
          )}
        </div>
      ))}
    </div>
  );
}
