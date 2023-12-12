const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Get the join form.
router.get('/', userController.userJoinGet);

// Post on the join form.
router.post(
	'/',
	userController.validateUserMembership,
	userController.userJoinPost
);

module.exports = router;
