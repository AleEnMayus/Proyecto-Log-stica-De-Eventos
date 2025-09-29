const express = require('express');
const router = express.Router();
const { fetchAllEvents } = require('../controllers/eventController');

router.get('/', fetchAllEvents);

module.exports = router;
