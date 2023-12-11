const Message = require('../models/message');

// Display new message form on get.
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
