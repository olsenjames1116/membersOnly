require('dotenv').config({ path: `${__dirname}/.env` });
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');

const indexRouter = require('./routes/index');
const signUpRouter = require('./routes/signUp');
const logInRouter = require('./routes/login');
const logOutRouter = require('./routes/logout');
const messageRouter = require('./routes/messages');
const joinRouter = require('./routes/join');
const adminRouter = require('./routes/admin');

const User = require('./models/user');

const app = express();

// Set up mongoose connection.
mongoose.set('strictQuery', false);

const mongoDB = process.env.PRODDB_URI || process.env.DEVDB_URI;
main().catch((err) => {
	console.log(err);
});
async function main() {
	await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware functions for passport.
// Validate user for log in.
passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ username: username });
			if (!user) {
				return done(null, false, {
					message: 'Incorrect username or password.',
				});
			}
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return done(null, false, {
					message: 'Incorrect username or password.',
				});
			}
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);
// Store and access cookie data for user.
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

app.use(logger('dev'));
app.use(express.json());
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.currentUserIsMember = req.user ? req.user.isMember : '';
	res.locals.currentUserIsAdmin = req.user ? req.user.isAdmin : '';
	next();
});
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet());
app.use(compression());

// Set up routes.
app.use('/', indexRouter);
app.use('/sign-up', signUpRouter);
app.use('/log-in', logInRouter);
app.use('/log-out', logOutRouter);
app.use('/messages', messageRouter);
app.use('/join-form', joinRouter);
app.use('/admin-form', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
