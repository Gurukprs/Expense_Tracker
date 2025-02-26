import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EventDetails from './pages/EventDetails';
import AdminPanel from './pages/AdminPanel';
import AdminEventManagement from './pages/AdminEventManagement';
import AdminEventEdit from './pages/AdminEventEdit';

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/event/:id" element={user ? <EventDetails /> : <Navigate to="/" />} />

      {/* Admin Routes */}
      <Route path="/admin" element={user?.isAdmin ? <AdminEventManagement /> : <Navigate to="/" />} />
      <Route path="/admin/create-event" element={user?.isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
      {/* <Route path="/admin/events" element={user?.isAdmin ? <AdminEventManagement /> : <Navigate to="/" />} /> */}
      <Route path="/admin/events/:id" element={user?.isAdmin ? <AdminEventEdit /> : <Navigate to="/" />} />
    </Routes>
  );
};

export default App;
