// routes/authRoutes.js
const express = require('express');
const router = express.Router();

// RUTA CORREGIDA: Accede al archivo 'authControllers.js'
const authController = require('../controllers/authControllers'); 

// Rutas de autenticación
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;