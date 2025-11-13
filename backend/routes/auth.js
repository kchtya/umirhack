const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Регистрация
router.post('/register', authController.register);

// Вход
router.post('/login', authController.login);

// Выход
router.post('/logout', authController.logout);

module.exports = router;