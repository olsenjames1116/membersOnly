const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	text: { type: String, required: true },
	timestamp: { type: Date, required: true },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Virtual for the message creation date formatted.
MessageSchema.virtual('timestampFormatted').get(function () {
	return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

// Export model.
module.exports = mongoose.model('Message', MessageSchema);
