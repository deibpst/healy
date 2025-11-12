// controllers/authControllers.js
const User = require('../models/User'); // RUTA CORREGIDA
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d', 
  });
};

// --- POST /api/auth/register ---
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, cedula } = req.body;
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: 'El usuario ya existe con este correo.' });
    }

    if (role === 'fisioterapeuta' && !cedula) {
      return res.status(400).json({ msg: 'La cédula profesional es obligatoria para fisioterapeutas.' });
    }
    
    if (role !== 'paciente' && role !== 'fisioterapeuta') {
        return res.status(400).json({ msg: 'Rol inválido.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      cedula: role === 'fisioterapeuta' ? cedula : null, 
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
      redirectPath: '/login' 
    });

  } catch (error) {
    console.error('Error en el registro:', error.message);
    res.status(500).send('Error del servidor');
  }
};


// --- POST /api/auth/login ---
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciales inválidas (Usuario no encontrado).' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas (Contraseña incorrecta).' });
    }

    // Lógica de redirección por rol
    let redirectPath;
    if (user.role === 'paciente') {
      redirectPath = '/patient-dashboard';
    } else if (user.role === 'fisioterapeuta') {
      redirectPath = '/calendar'; 
    } else {
        redirectPath = '/dashboard'; 
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
      redirectPath: redirectPath 
    });

  } catch (error) {
    console.error('Error en el login:', error.message);
    res.status(500).send('Error del servidor');
  }
};