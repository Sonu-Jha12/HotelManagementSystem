import CrudPage from '../components/CrudPage.jsx';

export default function Guests() {
  return <CrudPage title="Guests" noun="guest" endpoint="/guests"
    columns={[{ key: 'name', label: 'Name', render: g => <b>{g.name}</b> }, { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' }, { key: 'idProof', label: 'ID proof' }]}
    fields={[{ name: 'name', label: 'Full name', required: true }, { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Phone' }, { name: 'address', label: 'Address' }, { name: 'idProof', label: 'ID proof number' }]} />;
}
