import { useEffect, useState } from 'react';
import { api, fmtDate, money } from '../api.js';
import { useAuth } from '../auth.jsx';
import { Badge, FormModal, PageHeader, Row, Table } from '../components/ui.jsx';

const day = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

export default function Bookings() {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [guests, setGuests] = useState([]);
  const [free, setFree] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const load = () => Promise.all([api('/bookings'), api('/guests')])
    .then(([b, g]) => { setBookings(b); setGuests(g); }).catch(e => setError(e.message));
  useEffect(() => { load(); }, []);

  // Room list depends on the chosen dates, so reload it whenever the dates change.
  const findRooms = (from, to) => from && to && to > from && api(`/rooms/available?from=${from}&to=${to}`).then(setFree).catch(() => setFree([]));
  const startBooking = () => {
    if (!guests.length) return alert('Add a guest first.');
    findRooms(day(0), day(1)); setOpen(true);
  };

  const act = async (fn) => { try { await fn(); load(); } catch (e) { alert(e.message); } };
  const status = (id, s) => act(() => api(`/bookings/${id}/status`, 'PATCH', { status: s }));
  const pay = b => { const a = prompt(`Payment amount (balance ${money(b.total - b.paid)})`); if (a) act(() => api(`/bookings/${b._id}/payments`, 'POST', { amount: a })); };
  const addService = b => {
    const name = prompt('Service (e.g. Laundry)'); if (!name) return;
    const amount = prompt('Charge (₹)'); if (amount) act(() => api(`/bookings/${b._id}/services`, 'POST', { name, amount }));
  };
  const remove = id => confirm('Delete this booking?') && act(() => api(`/bookings/${id}`, 'DELETE'));
  const steps = b => ({ reserved: [['Check in', 'checked-in'], ['Cancel', 'cancelled']], 'checked-in': [['Check out', 'checked-out']] }[b.status] || []);

  return (
    <>
      <PageHeader title="Bookings"><button className="btn" onClick={startBooking}>New booking</button></PageHeader>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <Table heads={['Guest', 'Room', 'Dates', 'Total', 'Balance', 'Status', '']} rows={bookings.map(b => (
        <Row key={b._id} cells={[<b>{b.guest?.name || 'Deleted guest'}</b>, b.room?.number || '-', `${fmtDate(b.checkIn)} to ${fmtDate(b.checkOut)}`,
          money(b.total), money(b.total - b.paid), <Badge value={b.status} />,
          <div className="flex gap-2 justify-end flex-wrap">
            {steps(b).map(([t, s]) => <button key={s} className="btn-o" onClick={() => status(b._id, s)}>{t}</button>)}
            {b.status !== 'cancelled' && <button className="btn-o" onClick={() => addService(b)}>Add charge</button>}
            {b.total > b.paid && b.status !== 'cancelled' && <button className="btn-o" onClick={() => pay(b)}>Take payment</button>}
            {isAdmin && <button className="btn-o text-red-700" onClick={() => remove(b._id)}>Delete</button>}
          </div>]} />
      ))} />
      {open && <FormModal title="New booking" onClose={saved => { setOpen(false); if (saved) load(); }}
        onChange={d => findRooms(d.checkIn, d.checkOut)}
        onSave={d => api('/bookings', 'POST', { ...d, guests: Number(d.guests) })}
        fields={[
          { name: 'guest', label: 'Guest', options: guests.map(g => [g._id, g.name]) },
          { name: 'checkIn', label: 'Check-in', type: 'date', value: day(0), required: true },
          { name: 'checkOut', label: 'Check-out', type: 'date', value: day(1), required: true },
          { name: 'room', label: free.length ? 'Available rooms' : 'No rooms free for these dates',
            options: free.length ? free.map(r => [r._id, `${r.number} · ${r.type} · ${money(r.price)}`]) : [['', 'None']] },
          { name: 'guests', label: 'Number of guests', type: 'number', value: 1, min: 1 }]} />}
    </>
  );
}
