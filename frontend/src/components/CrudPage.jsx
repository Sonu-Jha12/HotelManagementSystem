import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../auth.jsx';
import { FormModal, PageHeader, Row, Table } from './ui.jsx';

// Reusable list + add/edit/delete view for a simple resource (Rooms, Guests, Staff).
export default function CrudPage({ title, noun, endpoint, columns, fields, canEdit = true }) {
  const { isAdmin } = useAuth();
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');
  const load = () => api(endpoint).then(setItems).catch(e => setError(e.message));
  useEffect(() => { load(); }, []);

  const remove = async id => {
    if (!confirm(`Delete this ${noun}?`)) return;
    try { await api(`${endpoint}/${id}`, 'DELETE'); load(); } catch (e) { alert(e.message); }
  };
  const save = data => modal.item ? api(`${endpoint}/${modal.item._id}`, 'PUT', data) : api(endpoint, 'POST', data);

  return (
    <>
      <PageHeader title={title}><button className="btn" onClick={() => setModal({})}>Add {noun}</button></PageHeader>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <Table heads={[...columns.map(c => c.label), '']} rows={items.map(it => (
        <Row key={it._id} cells={[...columns.map(c => c.render ? c.render(it) : it[c.key] || '-'),
          <div className="flex gap-2 justify-end">
            {canEdit && <button className="btn-o" onClick={() => setModal({ item: it })}>Edit</button>}
            {isAdmin && <button className="btn-o text-red-700" onClick={() => remove(it._id)}>Delete</button>}
          </div>]} />
      ))} />
      {modal && <FormModal title={modal.item ? `Edit ${noun}` : `Add ${noun}`} fields={fields} values={modal.item}
        onSave={save} onClose={saved => { setModal(null); if (saved) load(); }} />}
    </>
  );
}
