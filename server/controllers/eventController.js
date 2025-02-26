const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, criteria } = req.body;
    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.expenses.push({ description, amount, criteria });
    await event.save();
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error adding expense', error });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: 'Event deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting event', error });
  }
};
