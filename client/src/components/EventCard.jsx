import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminEventCard.css'; // Import your CSS file for styling

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  if (!event || !event.name) {
    return <p>Error loading event</p>;
  }

  return (
    <div className="event-card" onClick={() => navigate(`/event/${event._id}`)}>
      <h3>{event.name}</h3>
      <p>{new Date(event.date).toLocaleDateString()}</p>
    </div>
  );
};

export default EventCard;
