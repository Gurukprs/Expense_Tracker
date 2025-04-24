import React, { useEffect, useState } from 'react';
import AdminEventCard from '../components/AdminEventCard';
import AdminNavbar from '../components/AdminNavbar';
import './styles/AdminEventManagement.css'; // Import your CSS file for styling
const AdminEventManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/event/all');
        if (!response.ok) throw new Error("Failed to fetch events.");
        
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
    <AdminNavbar />
    <div className="admin-events">
      <h2>Manage Events</h2>
      {loading ? <p>Loading events...</p> : error ? <p>Error: {error}</p> : (
        <div className="event-list">
          {events.map(event => <AdminEventCard key={event._id} event={event} />)}
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminEventManagement;
