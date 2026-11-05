import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Rooms from './pages/Rooms.jsx';
import Guests from './pages/Guests.jsx';
import Bookings from './pages/Bookings.jsx';
import Users from './pages/Users.jsx';

export default function App() {
  const { user, logout, isAdmin } = useAuth();
  if (!user) return <Routes><Route path="*" element={<Login />} /></Routes>;

  const links = [['/', 'Dashboard'], ['/rooms', 'Rooms'], ['/guests', 'Guests'], ['/bookings', 'Bookings'], ...(isAdmin ? [['/users', 'Staff']] : [])];
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-ink text-white md:w-56 md:min-h-screen p-4 flex md:flex-col gap-1 overflow-x-auto">
        <div className="font-head text-xl px-3 py-2 md:mb-6 whitespace-nowrap">Harbor Hotel</div>
        <nav className="flex md:flex-col gap-1 flex-1">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `px-3 py-2 rounded-lg whitespace-nowrap ${isActive ? 'bg-white/15' : 'text-white/70 hover:text-white'}`}>{label}</NavLink>
          ))}
        </nav>
        <div className="px-3 py-2 text-sm text-white/60 whitespace-nowrap">{user.name} ({user.role})</div>
        <button onClick={logout} className="text-left px-3 py-2 text-white/70 hover:text-white">Sign out</button>
      </aside>
      <main className="flex-1 p-5 md:p-8 max-w-6xl">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/users" element={isAdmin ? <Users /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
