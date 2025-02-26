const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  user: { type: String, required: true },
  item: { type: String, required: true },
  amount: { type: Number, required: true },
  criteria: { type: String, required: true },
  date: { type: Date, required: true }
});

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  criteria: [
    {
      name: { type: String, required: true },
      maxBudget: { type: Number, required: true },
      totalSpent: { type: Number, default: 0 }
    }
  ],
  expenses: [ExpenseSchema] // Store full expense details
});

module.exports = mongoose.model('Event', EventSchema);
