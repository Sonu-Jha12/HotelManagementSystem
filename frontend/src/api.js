// Thin fetch wrapper: adds the JWT and turns API errors into thrown Errors.
export async function api(path, method = 'GET', body) {
  const res = await fetch('/api' + path, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + localStorage.getItem('token') },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path !== '/auth/login') {
    localStorage.clear(); window.location.href = '/login';
  }
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}
export const money = n => '₹' + Number(n || 0).toLocaleString('en-IN');
export const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
