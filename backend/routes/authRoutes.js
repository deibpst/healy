// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/me', authController.getProfile);
router.put('/update-profile', authController.updateProfile);
router.get('/check-token', authController.checkToken); // Nueva ruta para verificar token

module.exports = router;