import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      navigate('/login');
    } catch {
      setLoggingOut(false);
    }
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <div className="avatar">{initials}</div>
        <h2>Hello, {user?.name}!</h2>
        <span className="email-badge">{user?.email}</span>
        <p className="meta">You are successfully authenticated. Your session persists on page refresh.</p>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
}
