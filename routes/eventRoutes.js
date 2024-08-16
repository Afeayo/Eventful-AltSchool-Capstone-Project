const express = require('express');
const {
    createEvent,
    getMyEvents,
    getMyApplications,
    getCreateEventPage,
    purchaseTicket,
    getAttendeeDashboard,
    getRemindersPage,
    setReminder,
    getEventDetails,
    editEvent,
    deleteEvent
} = require('../controller/eventController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { logout } = require('../controller/authController');
const router = express.Router();

// Route to display the "Create Event" form
router.get('/create-event', protect, authorize('creator'), getCreateEventPage);

// Route to handle form submission for creating an event
router.post('/create-event', protect, authorize('creator'), createEvent);

// Route to get events created by the user
router.get('/myEvents', protect, authorize('creator'), getMyEvents);

// Route to view the "Edit Event" form
// Route to view the "Edit Event" form
router.get('/myEvents/:id', protect, authorize('creator'), getEventDetails);


// Route to handle form submission for editing an event
router.post('/myEvents/:id/edit', protect, authorize('creator'), editEvent);

// Route to delete an event
router.post('/myEvents/:id/delete', protect, authorize('creator'), deleteEvent);

// Route to log out
router.get('/logout', logout);

// Route to view the "Set Reminders" page
router.get('/reminders', protect, authorize('creator'), getRemindersPage);

// Route to handle form submission for setting a reminder
router.post('/reminders', protect, authorize('creator'), setReminder);

// Route to handle ticket purchase
router.post('/purchase-ticket', protect, purchaseTicket);

// Route to get the attendee dashboard
router.get('/dashboard', protect, authorize('creator'), getAttendeeDashboard);

// Route for viewing event details by ID
router.get('/myEvents/:id', protect, authorize('creator'), getEventDetails);

module.exports = router;
