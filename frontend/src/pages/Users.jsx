import CrudPage from '../components/CrudPage.jsx';
import { Badge } from '../components/ui.jsx';

export default function Users() {
  return <CrudPage title="Staff" noun="staff member" endpoint="/users" canEdit={false}
    columns={[{ key: 'name', label: 'Name', render: u => <b>{u.name}</b> }, { key: 'email', label: 'Email' },
      { label: 'Role', render: u => <Badge value={u.role} /> }]}
    fields={[{ name: 'name', label: 'Full name', required: true }, { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'password', label: 'Password (6+ characters)', type: 'password', required: true },
      { name: 'role', label: 'Role', options: [['staff', 'staff'], ['admin', 'admin']] }]} />;
}
