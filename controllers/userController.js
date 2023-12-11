const User = require('../models/user');

// Display sign up form on get.
exports.userCreateGet = async function (req, res, next) {
	try {
		res.render('signUpForm', { title: 'Sign Up' });
	} catch (err) {
		return next(err);
	}
};

// Display sign up from on post.
exports.userCreatePost = async function (req, res, next) {
	try {
		res.send('NOT IMPLEMENTED: Sign up post');
	} catch (err) {
		return next(err);
	}
};
