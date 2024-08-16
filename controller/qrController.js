const QRCode = require('qrcode');

// purchaseTicket method
exports.purchaseTicket = async (req, res) => {
    const { eventId } = req.body;

    try {
        const event = await Event.findById(eventId);

        if (!event) {
            req.flash('error_msg', 'Event not found');
            return res.redirect('/');
        }

        event.attendees.push(req.user._id);
        await event.save();

        // Generate QR Code
        const qrData = JSON.stringify({ eventId: event._id, userId: req.user._id });
        const qrCodeUrl = await QRCode.toDataURL(qrData);

        // Save the QR code URL with the attendee
        const attendee = {
            user: req.user._id,
            qrCode: qrCodeUrl
        };

        event.attendees.push(attendee);
        await event.save();

        req.flash('success_msg', 'Ticket purchased successfully');
        
        // Redirect to attendee dashboard after purchasing a ticket
        res.redirect('/attendee/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

