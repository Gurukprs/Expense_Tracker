import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminEventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedCriteria, setUpdatedCriteria] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/event/${id}`);
        if (!response.ok) throw new Error("Failed to fetch event details.");

        const data = await response.json();
        setEvent(data);
        setUpdatedCriteria(data.criteria || []); // Ensure criteria is not undefined
      } catch (error) {
        console.error("Error fetching event:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBudgetChange = (index, value) => {
    const newCriteria = [...updatedCriteria];
    newCriteria[index].maxBudget = parseFloat(value) || 0;
    setUpdatedCriteria(newCriteria);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/event/${id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ criteria: updatedCriteria }),
      });

      if (!response.ok) throw new Error("Failed to update event.");

      alert("Event updated successfully!");
      navigate('/admin/events');
    } catch (error) {
      console.error("Error updating event:", error);
      alert(error.message);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      const response = await fetch(`http://localhost:5000/event/${id}/expense/${expenseId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete expense");
      }
  
      // Refresh event data after deleting expense
      const updatedEvent = await fetch(`http://localhost:5000/event/${id}`);
      const data = await updatedEvent.json();
      setEvent(data);
  
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert(error.message);
    }
  };
  
  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`http://localhost:5000/event/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error("Failed to delete event.");

      alert("Event deleted successfully!");
      navigate('/admin/events');
    } catch (error) {
      console.error("Error deleting event:", error);
      alert(error.message);
    }
  };

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!event) return <p>No event found.</p>; // Prevents crash if event is undefined

  return (
    <div className="admin-event-edit">
      <h2>Edit Event: {event.name}</h2>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>

      <h3>Edit Max Budget</h3>
        <ul>
        {updatedCriteria.map((c, index) => (
            <li key={c.name}>
            <strong>{c.name}</strong>: 
            <input type="number" value={c.maxBudget} onChange={(e) => handleBudgetChange(index, e.target.value)} />
            </li>
        ))}
        </ul>

      <button onClick={handleSaveChanges}>Save Changes</button>
      <button onClick={handleDeleteEvent}>Delete Event</button>

      <h3>User Expenses</h3>
        <table border="1">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Expense (Criterion)</th>
              <th>Date of Purchase</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {event.expenses.length > 0 ? (
              event.expenses.map((exp, index) => (
                <tr key={index}>
                  <td>{exp.user}</td>
                  <td>{exp.item}</td>
                  <td>${exp.amount}</td>
                  <td>{exp.criteria}</td>
                  <td>{new Date(exp.date).toLocaleDateString()}</td>
                  <td><button onClick={() => handleDeleteExpense(exp._id)}>Delete</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No expenses recorded.</td>
              </tr>
            )}
          </tbody>
        </table>

      <h3>Total Expenses</h3>
      <ul>
        {event.criteria.map((c) => (
          <li key={c.name}>
            {c.name}: ${c.totalSpent} spent / ${c.maxBudget} allocated - Remaining: ${c.maxBudget - c.totalSpent}
          </li>
        ))}
      </ul>

      <h3>Net Total Spent: ${event.criteria.reduce((sum, c) => sum + c.totalSpent, 0)}</h3>
    </div>
  );
};

export default AdminEventEdit;
