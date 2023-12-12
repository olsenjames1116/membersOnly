const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Get the join form.
router.get('/', userController.userJoinGet);

module.exports = router;
