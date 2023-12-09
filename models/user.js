const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
	firstName: { type: String, required: true, maxLength: 100 },
	lastName: { type: String, required: true, maxLength: 100 },
	username: { type: String, required: true, maxLength: 100 },
	password: { type: String, required: true, maxLength: 100 },
	isMember: { type: Boolean, required: true, default: false },
	isAdmin: { type: Boolean, required: true, default: false },
});

// Virtual for user's full name.
UserSchema.virtual('fullName').get(function () {
	return `${this.firstName} ${this.lastName}`;
});

// Export model.
module.exports = mongoose.model('User', UserSchema);
