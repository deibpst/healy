// controllers/authControllers.js
const User = require('../models/user'); // ruta corregida
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Importar Google OAuth2
const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// --- POST /api/auth/register ---
exports.registerUser = async (req, res) => {
  try {
    const { nombre, apellidos, email, contrasena, telefono, rol } = req.body;

    if (!nombre || !apellidos || !email || !contrasena || !rol) {
      return res.status(400).json({ msg: 'Faltan campos obligatorios.' });
    }
    if (rol !== 'paciente' && rol !== 'fisioterapeuta') {
      return res.status(400).json({ msg: 'Rol inválido.' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ msg: 'El usuario ya existe con este correo.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const user = await User.create({
      nombre,
      apellidos,
      email,
      contrasena: hashedPassword,
      telefono: telefono || null,
      rol
    });

    res.status(201).json({
      id: user.usuario_id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      rol: user.rol,
      token: generateToken(user.usuario_id),
      redirectPath: '/login'
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).send('Error del servidor');
  }
};

// --- POST /api/auth/login ---
exports.loginUser = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res.status(400).json({ msg: 'Correo y contraseña son obligatorios.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas (Usuario no encontrado).' });
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas (Contraseña incorrecta).' });
    }

    let redirectPath;
    let googleAuthUrl = null;
    let googleAccessToken = null;

    if (user.rol === 'paciente') {
      redirectPath = '/patient-dashboard';
    } else if (user.rol === 'fisioterapeuta') {
      redirectPath = '/calendar';

      // 🔑 Si ya tiene refresh_token guardado, obtener access_token automático
      if (user.google_refresh_token) {
        oauth2Client.setCredentials({ refresh_token: user.google_refresh_token });
        const accessToken = await oauth2Client.getAccessToken();
        googleAccessToken = accessToken.token;
      } else {
        // Si no tiene refresh_token, enviar la URL de autorización
        googleAuthUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: ['https://www.googleapis.com/auth/calendar'],
        });
      }
    } else {
      redirectPath = '/dashboard';
    }

    res.json({
      id: user.usuario_id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      rol: user.rol,
      token: generateToken(user.usuario_id),
      redirectPath,
      googleAuthUrl,     // 👉 si no tiene refresh_token, el frontend redirige a Google
      googleAccessToken  // 👉 si ya tiene refresh_token, el frontend recibe access_token directo
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).send('Error del servidor');
  }
};
