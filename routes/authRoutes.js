const express = require('express');
const { register, login, getLoginPage, getRegisterPage, logout, getDashdashboard } = require('../controller/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.get('/register', getRegisterPage);
router.post('/login', login);
router.get('/login', getLoginPage);
router.get('/logout', logout);
module.exports = router;
