const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const dashboard = require('./routes/dashboard.js');
const protect = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');


require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const homeRoutes = require('./routes/homeRoutes');
const attendeeRoutes = require('./routes/attendeeRoutes.js');



const app = express();


app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
app.use('/attendee', attendeeRoutes);
app.use(dashboard)
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/', homeRoutes);
app.use('/creator', eventRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });

/*mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));*/

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
