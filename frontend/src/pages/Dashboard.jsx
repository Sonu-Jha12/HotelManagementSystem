import { useEffect, useState } from 'react';
import { api, fmtDate, money } from '../api.js';
import { Badge, PageHeader, Row, Table } from '../components/ui.jsx';

export default function Dashboard() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api('/stats').then(setS).catch(e => setErr(e.message)); }, []);
  if (err) return <p className="text-red-600">{err}</p>;
  if (!s) return <p className="text-slate-500">Loading dashboard…</p>;

  const cards = [['Rooms occupied', `${s.occupied} / ${s.rooms}`], ['Arrivals today', s.arrivals], ['Departures today', s.departures],
    ['Revenue', money(s.revenue)], ['Collected', money(s.collected)], ['Outstanding', money(s.revenue - s.collected)]];
  const max = Math.max(1, ...s.monthly.map(m => m.revenue));
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(([l, v]) => (
          <div key={l} className="bg-white border border-slate-200 rounded-xl p-5">
            <p className="text-slate-500 text-sm">{l}</p><p className="font-head text-3xl text-ink mt-1">{v}</p>
          </div>
        ))}
      </div>
      <h3 className="font-head text-xl text-ink mt-8 mb-3">Booking value by month</h3>
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-end gap-4 h-48">
        {s.monthly.length ? s.monthly.map(m => (
          <div key={m._id} className="flex-1 flex flex-col items-center justify-end h-full">
            <span className="text-xs text-slate-500 mb-1">{money(m.revenue)}</span>
            <div className="w-full bg-sea rounded-t" style={{ height: `${(m.revenue / max) * 70}%` }} />
            <span className="text-xs mt-1">{m._id}</span>
          </div>
        )) : <p className="text-slate-500 m-auto">Monthly totals appear after your first booking.</p>}
      </div>
      <h3 className="font-head text-xl text-ink mt-8 mb-3">Latest bookings</h3>
      <Table heads={['Guest', 'Room', 'Dates', 'Status']} empty="No bookings yet."
        rows={s.recent.map(b => <Row key={b._id} cells={[b.guest?.name || '-', b.room?.number || '-', `${fmtDate(b.checkIn)} to ${fmtDate(b.checkOut)}`, <Badge value={b.status} />]} />)} />
    </>
  );
}
