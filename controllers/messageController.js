const { body, validationResult } = require('express-validator');
const Message = require('../models/message');

// Display message list on get.
exports.messageListGet = async (req, res, next) => {
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
};

// Display new message form on get.
exports.messageCreateGet = async (req, res, next) => {
	try {
		res.render('messageForm', {
			title: 'New Message',
		});
	} catch (err) {
		return next(err);
	}
};

// Validate and sanitize fields.
exports.validateMessage = [
	body('text', 'Text must not be left empty.').trim().escape().notEmpty(),
];

exports.messageCreatePost =
	// Process request after validation and sanitization.
	async (req, res, next) => {
		try {
			// Extract the validation errors from the request.
			const errors = validationResult(req);

			// Create a Message object with escaped and trimmed data.
			const message = new Message({
				text: req.body.text,
				timestamp: Date.now(),
			});

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/error messages.
				res.render('messageForm', {
					title: 'New Message',
					message: message,
					errors: errors.array(),
				});

				return;
			} else {
				// Data from form is valid. Save message.
				await message.save();
				res.redirect('/messages');
			}
		} catch (err) {
			return next(err);
		}
	};
