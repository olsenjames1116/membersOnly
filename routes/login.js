const express = require('express');
const router = express.Router();

// GET log in form.
router.get('/', function (req, res, next) {
	res.send('NOT IMPLEMENTED: Login form get');
});

// POST log in form.
router.post('/', function (req, res, next) {
	res.send('NOT IMPLEMENTED: Login form post');
});

module.exports = router;
