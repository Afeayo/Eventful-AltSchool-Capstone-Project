const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const eventController = require('../controller/eventController');
const router = express.Router();

// Paystack callback route
router.get('/paystack/callback', eventController.handlePaystackCallback);

// Route to display the creator dashboard
router.get('/dashboard', protect, eventController.getCreatorDashboard);

// Route to create or update an event with pricing and reminders
router.post('/create-event', protect, eventController.createEvent);


module.exports = router;
