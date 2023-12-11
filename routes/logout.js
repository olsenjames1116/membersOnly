const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// GET log out.
router.get('/', userController.userLogOutGet);

module.exports = router;
