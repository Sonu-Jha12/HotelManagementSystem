import CrudPage from '../components/CrudPage.jsx';
import { Badge } from '../components/ui.jsx';
import { money } from '../api.js';

const types = ['Single', 'Double', 'Suite', 'Deluxe'].map(t => [t, t]);
export default function Rooms() {
  return <CrudPage title="Rooms" noun="room" endpoint="/rooms"
    columns={[{ key: 'number', label: 'Room', render: r => <b>{r.number}</b> }, { key: 'type', label: 'Type' },
      { label: 'Price', render: r => money(r.price) }, { key: 'capacity', label: 'Guests' }, { key: 'amenities', label: 'Amenities' },
      { label: 'Status', render: r => <Badge value={r.status} /> }]}
    fields={[{ name: 'number', label: 'Room number', required: true }, { name: 'type', label: 'Type', options: types },
      { name: 'price', label: 'Price per night (₹)', type: 'number', required: true, min: 0 },
      { name: 'capacity', label: 'Guests it fits', type: 'number', value: 2, min: 1 },
      { name: 'amenities', label: 'Amenities (AC, WiFi, sea view…)', required: false },
      { name: 'status', label: 'Status', options: [['available', 'available'], ['maintenance', 'maintenance']] }]} />;
}
