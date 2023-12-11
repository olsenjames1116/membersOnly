const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

// GET sign up form.
router.get('/', userController.userCreateGet);

// POST sign up form.
router.post('/', userController.userCreatePost);

module.exports = router;
