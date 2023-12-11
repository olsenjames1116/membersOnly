const express = require('express');
const router = express.Router();

// GET log out.
router.get('/', function (req, res, next) {
	res.send('NOT IMPLEMENTED: Log out');
});

module.exports = router;
