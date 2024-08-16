const express = require('express');
const { getHomePage } = require('../controller/homeController');

const router = express.Router();

router.get('/', getHomePage);

module.exports = router;
