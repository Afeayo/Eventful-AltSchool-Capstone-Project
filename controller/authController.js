const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            req.flash('error_msg', 'User already exists');
            return res.redirect('/api/auth/register');
        }

        const user = await User.create({
            name,
            email,
            password,
            role
        });

        // Automatically log the user in after registration
        const token = generateToken(user._id);
        res.cookie('token', token, { httpOnly: true });

        req.flash('success_msg', 'You are now registered and logged in');
        res.redirect('/dashboard'); // Redirect to the dashboard
    } catch (error) {
        console.error('Error during registration:', error);
        req.flash('error_msg', 'Server error during registration');
        res.redirect('/api/auth/register');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id);
            res.cookie('token', token, { httpOnly: true });

            // Example after login
            if (user.role === 'creator') {
                res.redirect('/dashboard');
            } else {
                res.redirect('/attendee/dashboard');
            }
        } else {
            req.flash('error_msg', 'Invalid email or password');
            res.redirect('/api/auth/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error_msg', 'Server error during login');
        res.redirect('/api/auth/login');
    }
};


exports.logout = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.redirect('/');
};

exports.getLoginPage = (req, res) => {
    res.render('layout/auth/login');
};

exports.getRegisterPage = (req, res) => {
    res.render('layout/auth/register');
};
