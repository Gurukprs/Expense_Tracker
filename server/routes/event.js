const express = require('express');
const Event = require('../models/Event');

const router = express.Router();

// Get All Events
router.get('/all', async (req, res) => {
  try {
    const events = await Event.find();
    console.log("Fetched Events:", events);  // Debugging line
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:eventId/expense/:expenseId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Find the expense to delete
    const expenseIndex = event.expenses.findIndex(exp => exp._id.toString() === req.params.expenseId);
    if (expenseIndex === -1) return res.status(404).json({ message: "Expense not found" });

    // Reduce total spent for the related criteria
    const deletedExpense = event.expenses[expenseIndex];
    event.criteria = event.criteria.map(c => 
      c.name === deletedExpense.criteria 
        ? { ...c, totalSpent: c.totalSpent - deletedExpense.amount } 
        : c
    );

    // Remove the expense
    event.expenses.splice(expenseIndex, 1);
    await event.save();

    res.json({ message: "Expense deleted successfully", event });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put('/:id/update', async (req, res) => {
  try {
    const { criteria } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { criteria },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/:id/expense", async (req, res) => {
//   try {
//     console.log("🚀 Expense request received:", req.body); // ✅ Debugging

//     const { user, item, amount, criteria } = req.body;

//     if (!user || !item || !amount || !criteria) {
//       console.log("🚨 Missing fields:", { user, item, amount, criteria });
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     console.log("✅ Storing expense for user:", user); // ✅ Confirm correct user before storing

//     const event = await Event.findById(req.params.id);
//     if (!event) return res.status(404).json({ message: "Event not found" });

//     if (!event.expenses) event.expenses = [];

//     event.expenses.push({ 
//       user,  
//       item, 
//       amount: parseFloat(amount), 
//       criteria, 
//       date: new Date(),
//     });

//     await event.save();
//     console.log("✅ Expense added successfully:", event.expenses);

//     res.json({ message: "Expense added successfully", event });
//   } catch (error) {
//     console.error("❌ Error adding expense:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

router.post("/:id/expense", async (req, res) => {
  try {
    console.log("🚀 Expense request received:", req.body); // ✅ Debugging

    const { user, item, amount, criteria } = req.body;

    if (!user || !item || !amount || !criteria) {
      console.log("🚨 Missing fields:", { user, item, amount, criteria });
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("✅ Storing expense for user:", user); // ✅ Confirm before storing

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!event.expenses) event.expenses = [];

    event.expenses.push({ 
      user,  
      item, 
      amount: parseFloat(amount), 
      criteria, 
      date: new Date(),
    });

    await event.save();
    console.log("✅ Expense added successfully:", event.expenses);

    res.json({ message: "Expense added successfully", event });
  } catch (error) {
    console.error("❌ Error adding expense:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    res.json({
      name: event.name,
      date: event.date,
      criteria: event.criteria || [], // Ensure criteria is never undefined
      expenses: event.expenses || [] // Ensure expenses is never undefined
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Create Event Route
router.post('/create', async (req, res) => {
  try {
    const { name, date, criteria } = req.body;

    // Debugging: Log incoming data
    console.log("Incoming Event Data:", req.body);

    // Validate input
    if (!name || !date || !criteria || !Array.isArray(criteria) || criteria.length === 0) {
      return res.status(400).json({ message: 'All fields required and at least one criterion must be selected' });
    }

    // Ensure maxBudget is valid for each criterion
    for (let c of criteria) {
      if (!c.name || typeof c.maxBudget !== 'number' || c.maxBudget < 0) {
        return res.status(400).json({ message: 'Invalid criteria format' });
      }
    }

    // Debugging: Check MongoDB connection
    if (!Event) {
      return res.status(500).json({ message: 'Database model is not defined' });
    }

    // Create the event
    const event = new Event({
      name,
      date,
      criteria: criteria.map(c => ({
        name: c.name,
        maxBudget: c.maxBudget,
        totalSpent: 0
      }))
    });

    await event.save();
    
    console.log("Event Created Successfully:", event);
    res.status(201).json(event);
  } catch (error) {
    console.error('Event Creation Error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
