const User = require('../models/user');

// Display sign up form on get.
exports.signUpGet = async function (req, res, next) {
	try {
		res.send('NOT IMPLEMENTED: Sign up get');
	} catch (err) {
		return next(err);
	}
};

// Display sign up from on post.
exports.signUpPost = async function (req, res, next) {
	try {
		res.send('NOT IMPLEMENTED: Sign up post');
	} catch (err) {
		return next(err);
	}
};
