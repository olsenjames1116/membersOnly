const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');

// Display sign up form on get.
exports.userCreateGet = async function (req, res, next) {
	try {
		if (req.user) {
			res.redirect('/');
		} else {
			res.render('signUpForm', { title: 'Sign Up' });
		}
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

// Display sign up form on post.
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

// Display log in form on get.
exports.userLogInGet = async function (req, res, next) {
	try {
		if (req.user) {
			res.redirect('/');
		} else {
			const errors = req.flash().error;
			res.render('logInForm', { title: 'Log In', errors: errors });
		}
	} catch (err) {
		return next(err);
	}
};

// Display log in form on post.
exports.userLogInPost = (req, res, next) => {
	const handleAuthentication = passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/log-in',
		failureFlash: true,
	});
	handleAuthentication(req, res, next);
};

// Get route to log user out.
exports.userLogOutGet = (req, res, next) => {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};

// Get route to make a user a member.
exports.userJoinGet = (req, res, next) => {
	try {
		if (!req.user || req.user.isMember) {
			res.redirect('/');
		} else {
			res.render('joinForm', {
				title: 'Join the Club',
			});
		}
	} catch (err) {
		return next(err);
	}
};

// Validate user for membership.
exports.validateUserMembership = [
	body('code')
		.trim()
		.escape()
		.notEmpty()
		.withMessage('Input field cannot be left empty.')
		.custom(async (code) => {
			if (code.toLowerCase() !== process.env.MEMBER_CODE) {
				throw new Error('Incorrect code.');
			}
		}),
];

// Post route to make a user a member.
exports.userJoinPost =
	// Process request after validation and sanitization.
	async (req, res, next) => {
		try {
			// Extract the validation errors from the request.
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/error messages.
				res.render('joinForm', {
					title: 'Join the Club',
					code: req.body.code,
					errors: errors.array(),
				});

				return;
			} else {
				// Data from form is valid. Update the membership of user.
				await User.findByIdAndUpdate(req.user._id, { isMember: true });
				res.redirect('/');
			}
		} catch (err) {
			return next(err);
		}
	};

// Get route to make user an admin.
exports.userAdminGet = async (req, res, next) => {
	try {
		if (!req.user || req.user.isAdmin) {
			res.redirect('/');
		} else {
			res.render('adminForm', {
				title: 'Become an Admin',
			});
		}
	} catch (err) {
		return next(err);
	}
};

// Validate user to become an admin.
exports.validateUserAdmin = [
	body('code')
		.trim()
		.escape()
		.notEmpty()
		.withMessage('Input field cannot be left empty.')
		.custom(async (code) => {
			if (code !== process.env.ADMIN_CODE) {
				throw new Error('Incorrect code.');
			}
		}),
];

// Post route to make user an admin.
exports.userAdminPost =
	// Process request after validation and sanitization.
	async (req, res, next) => {
		try {
			// Extract the validation errors from the request.
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				// There are errors. Render form again with sanitized values/error messages.
				res.render('adminForm', {
					title: 'Become an Admin',
					code: req.body.code,
					errors: errors.array(),
				});

				return;
			} else {
				// Data from form is valid. Update the admin status of the user.
				await User.findByIdAndUpdate(req.user._id, { isAdmin: true });
				res.redirect('/');
			}
		} catch (err) {
			return next(err);
		}
	};
