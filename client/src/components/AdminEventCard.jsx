import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminEventCard.css'; // Import your CSS file for styling

const AdminEventCard = ({ event }) => {
  const navigate = useNavigate();

  return (
    <div className="event-card" onClick={() => navigate(`/admin/events/${event._id}`)}>
      <h3>{event.name}</h3>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>
    </div>
  );
};

export default AdminEventCard;
