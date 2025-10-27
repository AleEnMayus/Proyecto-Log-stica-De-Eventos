const { getAllEvents } = require('../models/eventModel');

const fetchAllEvents = async (req, res) => {
  try {
    const events = await getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  fetchAllEvents,
};


