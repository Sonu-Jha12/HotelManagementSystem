import { useState } from 'react';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'admin@hotel.com', password: '' });
  const [err, setErr] = useState('');
  const submit = async e => { e.preventDefault(); try { await login(form.email, form.password); } catch (x) { setErr(x.message); } };
  return (
    <section className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-ink text-white p-12 flex-col justify-end">
        <h1 className="font-head text-5xl leading-tight max-w-md">Every room, guest and booking in one place.</h1>
        <p className="mt-4 text-white/70 max-w-sm">Harbor Hotel Manager keeps the front desk calm, even on a full night.</p>
      </div>
      <div className="flex items-center justify-center p-8">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <h2 className="font-head text-3xl text-ink">Sign in</h2>
          <input className="inp" type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input className="inp" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          <p className="text-red-600 text-sm">{err}</p>
          <button className="btn w-full">Sign in</button>
        </form>
      </div>
    </section>
  );
}
