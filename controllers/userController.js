const User = require('../models/user');
const { body, validationResult } = require('express-validator');

// Display sign up form on get.
exports.userCreateGet = async function (req, res, next) {
	try {
		res.render('signUpForm', { title: 'Sign Up' });
	} catch (err) {
		return next(err);
	}
};

// Display sign up from on post.
exports.userCreatePost = [
	// Validate and sanitize fields.
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
				await user.save();
				res.redirect('/');
			}
		} catch (err) {
			return next(err);
		}
	},
];
