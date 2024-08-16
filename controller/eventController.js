const Event = require('../model/eventModel');
const QRCode = require('qrcode');
const schedule = require('node-schedule');
const mongoose = require('mongoose');

// Create Event Function
exports.createEvent = async (req, res) => {
    const { title, description, date, price } = req.body;

    try {
        let event = await Event.create({
            title,
            description,
            date,
            price,
            organizer: req.user._id,
        });

        // Generate a shareable link
        event.shareableLink = `/creator/myEvents/${event._id}`;
        await event.save();

        req.flash('success_msg', 'Event created successfully');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Edit Event Function
exports.getEventDetails = async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching event details for ID: ${id}`);

    try {
        const event = await Event.findById(id).lean();
        if (!event) {
            console.log('Event not found');
            req.flash('error_msg', 'Event not found');
            return res.redirect('/creator/dashboard');
        }
        res.render('events/eventDetails', { event });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete Event Function
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;

    try {
        await Event.findByIdAndDelete(id);
        req.flash('success_msg', 'Event deleted successfully');
        res.redirect('/creator/myEvents');
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getMyEvents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    try {
        const events = await Event.find({ organizer: req.user._id })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalEvents = await Event.countDocuments({ organizer: req.user._id });

        res.render('events/myEvents', {
            events,
            currentPage: page,
            totalPages: Math.ceil(totalEvents / limit)
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Event Details for Edit Page
exports.getEventDetails = async (req, res) => {
    const { id } = req.params;

    try {
        console.log(`Fetching event details for ID: ${id}`); // Add this line
        const event = await Event.findById(id).lean();
        if (!event) {
            req.flash('error_msg', 'Event not found');
            return res.redirect('/creator/dashboard');
        }

        res.render('events/eventDetails', { event });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// eventController.js

exports.editEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!event) {
            return res.status(404).send('Event not found');
        }

        res.redirect('/creator/myEvents'); // Redirect to the list of events after successful edit
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};



// Purchase Ticket Function
exports.purchaseTicket = async (req, res) => {
    const { eventId } = req.body;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            req.flash('error_msg', 'Event not found');
            return res.redirect('/');
        }


        event.attendees.push(mongoose.Types.ObjectId(req.user._id));
        await event.save();

        req.flash('success_msg', 'Ticket purchased successfully');

        // Redirect to attendee dashboard after purchasing a ticket
        res.redirect('/attendee/dashboard');
    } catch (error) {
        console.error('Error purchasing ticket:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get My Events
exports.getMyEvents = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = 10; // Number of events per page

    try {
        console.log(`Fetching events for user ID: ${req.user._id} on page ${page}`);

        const events = await Event.find({ organizer: req.user._id })
            .skip((page - 1) * limit)
            .limit(limit);

        const totalEvents = await Event.countDocuments({ organizer: req.user._id });

        res.render('events/myEvents', {
            events,
            currentPage: page,
            totalPages: Math.ceil(totalEvents / limit)
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get My Applications
exports.getMyApplications = async (req, res) => {
    try {
        console.log(`Fetching applications for user ID: ${req.user._id}`);
        const events = await Event.find({ attendees: req.user._id });
        res.render('events/myApplications', { events });
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get Attendee Dashboard
exports.getAttendeeDashboard = async (req, res) => {
    try {
        console.log(`Fetching attendee dashboard for user ID: ${req.user._id}`);

        // Find events where the user is an attendee
        const events = await Event.find({ attendees: req.user._id });

        res.render('attendee/dashboard', { user: req.user, events });
    } catch (error) {
        console.error('Error fetching attendee dashboard:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get Reminders Page
exports.getRemindersPage = async (req, res) => {
    try {
        console.log(`Fetching reminders page`);
        const events = await Event.find(); // Fetch all events from the database
        res.render('reminders/setReminder', { events }); // Pass events to the template
    } catch (err) {
        console.error('Error fetching reminders page:', err);
        res.status(500).send('Server Error');
    }
};

// Set Reminder
exports.setReminder = (req, res) => {
    const { eventId, reminderDate } = req.body;

    try {
        console.log(`Setting reminder for event ID: ${eventId} on ${reminderDate}`);
        // Logic for setting the reminder, e.g., updating the event with a reminder date
        schedule.scheduleJob(new Date(reminderDate), function () {
            // Send reminder email/notification to the event's creator
            console.log(`Reminder triggered for event ID: ${eventId}`);
        });

        req.flash('success_msg', 'Reminder set successfully');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error setting reminder:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Create Event Page
exports.getCreateEventPage = (req, res) => {
    console.log('Rendering create event page');
    res.render('events/create');
};

// Handle Paystack callback
exports.handlePaystackCallback = async (req, res) => {
    const { reference } = req.query;

    try {
        console.log(`Verifying Paystack payment for reference: ${reference}`);
        const response = await paystack.transaction.verify({ reference });
        console.log('Paystack Response:', response); // Log the entire response for debugging

        if (response.data.status === 'success') {
            // Update event status or record the payment
            res.redirect('/creator/dashboard');
        } else {
            res.status(400).send('Payment failed');
        }
    } catch (error) {
        console.error('Error verifying Paystack payment:', error);
        res.status(500).send('Server Error');
    }
};

// Get Creator Dashboard
exports.getCreatorDashboard = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    try {
        console.log(`Fetching creator dashboard for user ID: ${req.user._id} on page ${page}`);

        const totalEvents = await Event.countDocuments({ organizer: req.user._id });

        const latestEvent = await Event.findOne({ organizer: req.user._id })
            .sort({ createdAt: -1 })
            .lean();

        const analytics = await Event.aggregate([
            { $match: { organizer: req.user._id } },
            {
                $group: {
                    _id: "$_id",
                    title: { $first: "$title" }, // Ensure the title field is correct
                    totalAttendees: {
                        $sum: {
                            $cond: {
                                if: { $isArray: "$attendees" },
                                then: { $size: "$attendees" },
                                else: 0
                            }
                        }
                    },
                    totalTicketsSold: { $sum: "$ticketsSold" },
                    totalQRScans: { $sum: "$qrScans" }
                }
            }
        ]);


        res.render('dashboard', {
            user: req.user,
            totalEvents,
            latestEvent,
            analytics,
            currentPage: page,
            totalPages: Math.ceil(totalEvents / limit)
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Server Error');
    }
};
