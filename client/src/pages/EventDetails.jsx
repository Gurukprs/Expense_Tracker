import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; 

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext); // ✅ Get logged-in user properly
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newExpense, setNewExpense] = useState({ item: '', amount: '', criteria: '' });

  useEffect(() => {
    console.log("🛠️ Current User from AuthContext:", user); // ✅ Debugging User Data
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5000/event/${id}`);
        if (!response.ok) throw new Error("Failed to fetch event details.");
        
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, user]); // ✅ Corrected Dependency Array

  // const handleAddExpense = async (e) => {
  //   e.preventDefault();
  
  //   if (!newExpense.item || !newExpense.amount || !newExpense.criteria) {
  //     alert("Please fill all fields.");
  //     return;
  //   }

  //   if (!user || !user.name) {
  //     alert("User information is missing. Please log in again.");
  //     return;
  //   }
  
  //   console.log("🚀 Submitting expense for user:", user.name); // ✅ Debugging
  
  //   try {
  //     const response = await fetch(`http://localhost:5000/event/${id}/expense`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ 
  //         user: user.name,  // ✅ Ensure correct user name is sent
  //         item: newExpense.item, 
  //         amount: parseFloat(newExpense.amount) || 0, 
  //         criteria: newExpense.criteria,
  //         date: new Date().toISOString(), // ✅ Auto-assign date
  //       }),
  //     });
  
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData.message || "Failed to add expense");
  //     }
  
  //     const updatedEvent = await fetch(`http://localhost:5000/event/${id}`);
  //     const data = await updatedEvent.json();
  //     setEvent(data);
  //     setNewExpense({ item: '', amount: '', criteria: '' });
  
  //   } catch (error) {
  //     console.error("❌ Error adding expense:", error);
  //     alert(error.message);
  //   }
  // };
  const handleAddExpense = async (e) => {
    e.preventDefault();
  
    if (!newExpense.item || !newExpense.amount || !newExpense.criteria) {
      alert("Please fill all fields.");
      return;
    }
  
    if (!user || !user.name) {
      alert("User information is missing. Please log in again.");
      return;
    }
  
    console.log("🚀 Submitting expense for user:", user.name); // ✅ Debugging
  
    try {
      const response = await fetch(`http://localhost:5000/event/${id}/expense`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user: user.name,  // ✅ Ensure correct user name is sent
          item: newExpense.item, 
          amount: parseFloat(newExpense.amount) || 0, 
          criteria: newExpense.criteria,
          date: new Date().toISOString(), // ✅ Auto-assign date
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add expense");
      }
  
      const updatedEvent = await fetch(`http://localhost:5000/event/${id}`);
      const data = await updatedEvent.json();
      setEvent(data);
      setNewExpense({ item: '', amount: '', criteria: '' });
  
    } catch (error) {
      console.error("❌ Error adding expense:", error);
      alert(error.message);
    }
  };  

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!event) return <p>Event not found.</p>;

  return (
    <div className="event-details">
      <h2>{event.name}</h2>
      <p>Date: {new Date(event.date).toLocaleDateString()}</p>

      <h3>Add Expense</h3>
      <form onSubmit={handleAddExpense}>
        <input 
          type="text" 
          placeholder="Item Name" 
          value={newExpense.item} 
          onChange={(e) => setNewExpense({ ...newExpense, item: e.target.value })} 
          required 
        />
        <input 
          type="number" 
          placeholder="Amount" 
          value={newExpense.amount} 
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} 
          required 
        />
        <select 
          value={newExpense.criteria} 
          onChange={(e) => setNewExpense({ ...newExpense, criteria: e.target.value })} 
          required
        >
          <option value="">Select Criteria</option>
          {event.criteria.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
        <button type="submit">Add Expense</button>
      </form>

      <h3>User Expenses</h3>
      <table border="1">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Expense (Criterion)</th>
            <th>Date of Purchase</th>
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No expenses recorded.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventDetails;
