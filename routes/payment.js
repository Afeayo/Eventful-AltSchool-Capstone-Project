const paystack = require('paystack-api')(process.env.PAYSTACK_SECRET);
const { protect, authorize } = require('../middleware/authMiddleware');
const express = require('express');


const router = express.Router();

router.get('/paystack/payment/:id', protect, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        const paymentDetails = {
            amount: event.price * 100, // Convert NGN to kobo
            email: req.user.email,
            callback_url: 'https://yourdomain.com/paystack/callback',
        };

        const paymentResponse = await paystack.transaction.initialize(paymentDetails);
        res.redirect(paymentResponse.data.authorization_url);
    } catch (error) {
        console.error('Error initializing Paystack payment:', error);
        res.status(500).send('Server Error');
    }
});
