import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AdminNavbar from '../components/AdminNavbar';

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [criteria, setCriteria] = useState([
    { name: 'Venue', selected: false, maxBudget: '' },
    { name: 'Food', selected: false, maxBudget: '' },
    { name: 'Materials', selected: false, maxBudget: '' },
    { name: 'Transport', selected: false, maxBudget: '' }
  ]);
  const [customCriteria, setCustomCriteria] = useState(''); // ✅ Define customCriteria

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) {
    return null;
  }

  const handleCheckboxChange = (index) => {
    const newCriteria = [...criteria];
    newCriteria[index].selected = !newCriteria[index].selected;
    setCriteria(newCriteria);
  };

  const handleBudgetChange = (index, value) => {
    const newCriteria = [...criteria];
    newCriteria[index].maxBudget = parseFloat(value) || '';
    setCriteria(newCriteria);
  };

  const handleAddCustomCriteria = () => {
    if (!customCriteria.trim()) return;
    setCriteria([...criteria, { name: customCriteria, selected: true, maxBudget: '' }]);
    setCustomCriteria('');
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const selectedCriteria = criteria
      .filter((c) => c.selected)
      .map((c) => ({ name: c.name, maxBudget: parseFloat(c.maxBudget) || 0 }));

    if (!eventName || !date || selectedCriteria.length === 0) {
      alert("Please fill all fields and select at least one criterion.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/event/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: eventName, date, criteria: selectedCriteria }),
      });

      if (!response.ok) throw new Error('Failed to create event');
      alert('Event Created Successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating event:', error);
      alert(error.message);
    }
  };

  return (
    <div>
    <AdminNavbar />
    <div className="admin-panel">
      {/*<h2>Admin Panel</h2>
      <button onClick={() => navigate('/admin/events')}>Manage Events</button> */}

      <h2>Create Event</h2>
      <form onSubmit={handleCreateEvent}>
        <input type="text" placeholder="Event Name" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

        <h3>Select Criteria & Set Max Budget</h3>
        {criteria.map((c, index) => (
          <div key={index}>
            <input type="checkbox" checked={c.selected} onChange={() => handleCheckboxChange(index)} />
            <label>{c.name}</label>
            {c.selected && (
              <input type="number" placeholder="Max Budget" value={c.maxBudget} onChange={(e) => handleBudgetChange(index, e.target.value)} required />
            )}
          </div>
        ))}

        {/* "Other" option for custom criteria */}
        <div>
          <input 
            type="text" 
            placeholder="Other Criteria" 
            value={customCriteria} 
            onChange={(e) => setCustomCriteria(e.target.value)} 
          />
          <button type="button" onClick={handleAddCustomCriteria}>Add</button>
        </div>

        <button type="submit">Create Event</button>
      </form>
    </div>
    </div>
  );
};

export default AdminPanel;
