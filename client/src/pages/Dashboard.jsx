import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import './styles/Dashboard.css';
import AuthContext from '../context/AuthContext'; // Adjust path if needed

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, user } = useContext(AuthContext); // ⬅️ Get logout from context

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('https://expense-tracker-3eaf.onrender.com/event/all');
        console.log("Fetched Events:", response.data);
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Events</h2>
        <div className="dashboard-actions">
          <span>Welcome, {user?.name || "User"}!</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="event-list">
          {events.map((event) => <EventCard key={event._id} event={event} />)}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
