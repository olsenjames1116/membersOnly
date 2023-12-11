const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	text: { type: String, required: true },
	timestamp: { time: Date },
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Export model.
module.exports = mongoose.model('Message', MessageSchema);
