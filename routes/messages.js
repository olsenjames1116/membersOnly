const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');

// GET a list of all messages.
router.get('/', messageController.messageListGet);

// GET the new message form.
router.get('/message-form', messageController.messageCreateGet);

// POST the new message form.
router.post(
	'/message-form',
	messageController.validateMessage,
	messageController.messageCreatePost
);

module.exports = router;
