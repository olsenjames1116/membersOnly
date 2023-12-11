const express = require('express');
const router = express.Router();

const Message = require('../models/message');

// GET a list of all messages.
router.get('/', async (req, res, next) => {
	try {
		const allMessages = await Message.find({}, 'text')
			.sort({ timestamp: -1 })
			.exec();

		res.render('messageList', {
			title: 'Grapevine Posts',
			messages: allMessages,
		});
	} catch (err) {
		return next(err);
	}
});

// GET the new message form.
router.get('/message-form', (req, res, next) => {
	res.send('NOT IMPLEMENTED: NEW MESSAGE GET.');
});

// POST the new message form.
router.post('/message-form', (req, res, next) => {
	res.send('NOT IMPLEMENTED: NEW MESSAGE POST.');
});

module.exports = router;
