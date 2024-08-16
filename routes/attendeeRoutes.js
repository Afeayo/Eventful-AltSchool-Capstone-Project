const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const Event = require('../model/eventModel');

const router = express.Router();

// Route to display the attendee dashboard
router.get('/dashboard', protect, authorize('attendee'), async (req, res) => {
    try {
        // Fetch the events that the attendee is attending
        const events = await Event.find({ attendees: req.user._id }).lean(); // Use .lean() for a plain JavaScript object

        // Render the attendee dashboard view with the required data
        res.render('attendee/dashboard', { user: req.user, events });
    } catch (error) {
        console.error('Error fetching attendee dashboard:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
