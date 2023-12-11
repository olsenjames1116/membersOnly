const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// GET log in form.
router.get('/', userController.userLogInGet);

// POST log in form.
router.post('/', function (req, res, next) {
	res.send('NOT IMPLEMENTED: Login form post');
});

module.exports = router;
