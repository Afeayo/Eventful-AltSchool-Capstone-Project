// controller/attendeeController.js
const Event = require('../model/eventModel');
const QRCode = require('qrcode');

// controller/attendeeController.js
exports.getAttendeeDashboard = async (req, res) => {
    console.log("Attendee dashboard route hit");  // Debugging line
    try {
        const events = await Event.find({ attendees: req.user._id });
        res.render('attend/dashboard', { user: req.user, events });
    } catch (error) {
        console.error('Error fetching attendee dashboard:', error);
        res.status(500).send('Server Error');
    }
};


exports.getEventsForAttendee = async (req, res) => {
    try {
        // Fetch all events that the attendee can attend
        const events = await Event.find();
        res.render('attendee/events', { user: req.user, events });  // Corrected path
    } catch (error) {
        console.error('Error fetching events for attendee:', error);
        res.status(500).send('Server Error');
    }
};

exports.setEventReminder = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { reminderTime } = req.body;

        // Logic to set the reminder for the event
        // You might store this in a separate Reminder model or within the Event model
        // This is a simplified example
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.reminders.push({ userId: req.user._id, time: reminderTime });
        await event.save();

        res.json({ message: 'Reminder set successfully' });
    } catch (error) {
        console.error('Error setting event reminder:', error);
        res.status(500).send('Server Error');
    }
};

exports.shareEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Logic to share the event on social media
        // For example, you could generate a shareable link or integrate with a social media API

        res.json({ message: 'Event shared successfully' });
    } catch (error) {
        console.error('Error sharing event:', error);
        res.status(500).send('Server Error');
    }
};
