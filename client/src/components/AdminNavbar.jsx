import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-left">
        <h2>Admin Panel</h2>
        <button onClick={() => navigate('/admin/create-event')}>Create Event</button>
      </div>
      <div className="admin-navbar-right">
        <span className="admin-welcome">Welcome, {user?.name || 'Admin'}!</span>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
