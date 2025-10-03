// backend/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET /api/users
router.get('/', userController.getUsers);

// POST /api/users
router.post('/', userController.createUser);

module.exports = router;