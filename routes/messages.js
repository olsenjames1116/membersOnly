const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');

// GET a list of all messages.
router.get('/', messageController.messageListGet);

// GET the new message form.
router.get('/message-form', (req, res, next) => {
	res.send('NOT IMPLEMENTED: NEW MESSAGE GET.');
});

// POST the new message form.
router.post('/message-form', (req, res, next) => {
	res.send('NOT IMPLEMENTED: NEW MESSAGE POST.');
});

module.exports = router;
