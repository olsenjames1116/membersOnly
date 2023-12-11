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
