<<<<<<< HEAD
const API_BASE = process.env.NEXT_PUBLIC_API_URL!;

=======
>>>>>>> 6594014023fcef589bfe87751302fdf6b68bec06
export async function apiFetch(
  path: string,
  options: RequestInit = {},
) {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  if (!API_BASE) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('token')
      : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(data?.message || 'הבקשה נכשלה');
  }

  return data;
}
