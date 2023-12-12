const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// Get the admin form.
router.get('/', userController.userAdminGet);

// Post on the admin form.
router.post('/', (req, res, next) => {
	res.send('NOT IMPLEMENTED: ADMIN FORM POST.');
});

module.exports = router;
