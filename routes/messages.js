const express = require('express');
const router = express.Router();

// GET a list of all messages.
router.get('/', (req, res, next) => {
	res.send('NOT IMPLEMENTED: LIST OF ALL MESSAGES.');
});

// GET the new message form.
router.get('/message-form', (req, res, next) => {
	res.send('NOT IMPLEMENTED: NEW MESSAGE GET.');
});

// POST the new message form.
router.post('/message-form', (req, res, next) => {
	res.send('NOT IMPLEMENTED: NEW MESSAGE POST.');
});

module.exports = router;
