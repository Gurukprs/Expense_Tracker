import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AdminNavbar.css'; // Import your CSS file for styling

const AdminNavbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="admin-navbar">
      <h2>Admin Panel</h2>
      {/* <button onClick={() => navigate('/admin')}>Manage Events</button> */}
      <button onClick={() => navigate('/admin/create-event')}>Create Event</button>
      <button onClick={logout}>Logout</button>
    </nav>
  );
};

export default AdminNavbar;
