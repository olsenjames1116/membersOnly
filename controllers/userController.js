const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Display sign up form on get.
exports.userCreateGet = async function (req, res, next) {
	try {
		res.render('signUpForm', { title: 'Sign Up' });
	} catch (err) {
		return next(err);
	}
};

// Validate and sanitize fields.
exports.validateUser = [
	body('firstName', 'First name must not be empty').trim().escape().notEmpty(),
	body('lastName', 'Last name must not be empty.').trim().escape().notEmpty(),
	body('username')
		.trim()
		.escape()
		.notEmpty()
		.withMessage('Username must not be empty.')
		.custom(async (username) => {
			const user = await User.findOne({ username: username });
			if (user) {
				throw new Error('Username is already in use.');
			}
		}),
	body('password', 'Password must not be empty.').trim().escape().notEmpty(),
	body('confirmPassword')
		.trim()
		.escape()
		.notEmpty()
		.withMessage('Confirmation password must not be empty.')
		.custom((confirmPassword, { req }) => {
			return confirmPassword === req.body.password;
		})
		.withMessage('Passwords must match.'),
];

// Hash the password before storing in the database.
const storeUser = (user) => {
	bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
		if (err) {
			return next(err);
		} else {
			user.password = hashedPassword;
			await user.save();
		}
	});
};

// Display sign up from on post.
exports.userCreatePost =
	// Process request after validation and sanitization.
	async (req, res, next) => {
		try {
			// Extract the validation errors from the request.
			const errors = validationResult(req);

			// Create a User object with escaped and trimmed data.
			const user = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				username: req.body.username,
				password: req.body.password,
			});

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/error messages.

				res.render('signUpForm', {
					title: 'Sign Up',
					user: user,
					confirmPassword: req.body.confirmPassword,
					errors: errors.array(),
				});

				return;
			} else {
				// Data from form is valid. Save user.
				storeUser(user);
				res.redirect('/');
			}
		} catch (err) {
			return next(err);
		}
	};
