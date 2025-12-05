// controllers/authControllers.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Importar Sequelize y Op para usar operadores
const { Sequelize, Op } = require('sequelize');

// Importar Google OAuth2
const { google } = require('googleapis');
const { sequelize } = require('../config/db');
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
    console.log('REGISTER REQUEST RECIBIDA');
    console.log('Body recibido:', req.body);

    const { nombre, apellidos, email, contrasena, telefono, rol } = req.body;

    if (!nombre || !apellidos || !email || !contrasena || !rol) {
      console.log('Faltan campos obligatorios');
      return res.status(400).json({ 
        success: false,
        msg: 'Faltan campos obligatorios.' 
      });
    }
    
    if (rol !== 'paciente' && rol !== 'fisioterapeuta') {
      console.log('Rol inválido:', rol);
      return res.status(400).json({ 
        success: false,
        msg: 'Rol inválido. Solo se permiten "paciente" o "fisioterapeuta".' 
      });
    }

    console.log('Verificando si el usuario ya existe:', email);
    const exists = await User.findOne({ where: { email } });
    
    if (exists) {
      console.log('Usuario ya existe con este correo');
      return res.status(400).json({ 
        success: false,
        msg: 'El correo electrónico ya está registrado. Por favor, usa otro.' 
      });
    }

    console.log('Encriptando contraseña...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    console.log('Creando usuario en la base de datos...');
    const user = await User.create({
      nombre,
      apellidos,
      email,
      contrasena: hashedPassword,
      telefono: telefono || null,
      rol
    });

    console.log('Usuario creado exitosamente:', user.email);
    
    const token = generateToken(user.usuario_id);
    
    return res.status(201).json({
      success: true,
      msg: 'Registro exitoso. Tu cuenta ha sido creada.',
      id: user.usuario_id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      rol: user.rol,
      token: token,
    });
    
  } catch (error) {
    console.error('ERROR en el registro:', error);
    return res.status(500).json({ 
      success: false,
      msg: 'Error interno del servidor al registrar usuario.',
      error: error.message
    });
  }
};

// --- POST /api/auth/login ---
exports.loginUser = async (req, res) => {
  try {
    console.log('LOGIN REQUEST RECIBIDA');
    console.log('Body recibido:', req.body);

    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      console.log('ERROR: Faltan campos obligatorios');
      return res.status(400).json({ 
        success: false,
        msg: 'Por favor, ingresa tu correo y contraseña.'  // SIN EMOJI
      });
    }

    console.log('Buscando usuario con email:', email);
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('ERROR: Usuario no encontrado');
      return res.status(400).json({ 
        success: false,
        msg: 'Usuario no encontrado. Verifica tu correo electrónico.'  // SIN EMOJI
      });
    }

    console.log('Usuario encontrado:', user.email);
    console.log('Comparando contraseña...');
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    
    if (!isMatch) {
      console.log('ERROR: Contraseña incorrecta');
      return res.status(400).json({ 
        success: false,
        msg: 'Contraseña incorrecta. Por favor, intenta nuevamente.'  // SIN EMOJI
      });
    }

    console.log('Contraseña correcta');
    
    let redirectPath;
    if (user.rol === 'paciente') {
      redirectPath = '/patient-dashboard';
    } else if (user.rol === 'fisioterapeuta') {
      redirectPath = '/calendar';
    } else {
      redirectPath = '/dashboard';
    }

    console.log('Generando token para usuario ID:', user.usuario_id);
    const token = generateToken(user.usuario_id);
    
    const responseData = {
      success: true,
      msg: 'Inicio de sesión exitoso. Redirigiendo...',  // SIN EMOJI
      id: user.usuario_id,
      nombre: user.nombre,
      apellidos: user.apellidos,
      email: user.email,
      telefono: user.telefono,
      rol: user.rol,
      token: token,
      redirectPath
    };

    console.log('Enviando respuesta de login exitoso');
    return res.json(responseData);

  } catch (error) {
    console.error('ERROR en el login:', error);
    return res.status(500).json({ 
      success: false,
      msg: 'Error interno del servidor. Por favor, intenta más tarde.',  // SIN EMOJI
      error: error.message
    });
  }
};

// --- GET /api/auth/me (Obtener perfil del usuario autenticado) ---
exports.getProfile = async (req, res) => {
  try {
    console.log('GET PROFILE REQUEST RECIBIDA');
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('ERROR: No hay token');
      return res.status(401).json({ 
        success: false, 
        msg: 'Sesión expirada. Por favor, inicia sesión nuevamente.'  // SIN EMOJI
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verificado, ID de usuario:', decoded.id);
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['contrasena'] }
    });
    
    if (!user) {
      console.log('ERROR: Usuario no encontrado');
      return res.status(404).json({ 
        success: false, 
        msg: 'Usuario no encontrado en el sistema.'  // SIN EMOJI
      });
    }
    
    console.log('Perfil obtenido para:', user.email);
    
    return res.status(200).json({
      success: true,
      msg: 'Perfil cargado exitosamente.',  // SIN EMOJI
      user: {
        usuario_id: user.usuario_id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono,
        rol: user.rol,
        fecha_registro: user.fecha_registro
      }
    });
    
  } catch (error) {
    console.error('ERROR al obtener perfil:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        msg: 'Token de sesión inválido. Por favor, inicia sesión nuevamente.'  // SIN EMOJI
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        msg: 'Sesión expirada. Por favor, inicia sesión nuevamente.'  // SIN EMOJI
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      msg: 'Error al cargar el perfil. Por favor, intenta más tarde.'  // SIN EMOJI
    });
  }
};

// --- PUT /api/auth/update-profile (Actualizar perfil) ---
exports.updateProfile = async (req, res) => {
  try {
    console.log('UPDATE PROFILE REQUEST RECIBIDA');
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('ERROR: No hay token');
      return res.status(401).json({ 
        success: false, 
        msg: 'Sesión expirada. Por favor, inicia sesión nuevamente.'  // SIN EMOJI
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario_id = decoded.id;
    console.log('Token verificado, ID de usuario:', usuario_id);
    
    const { email, telefono, contrasena } = req.body;
    
    console.log('Datos para actualizar:', { email, telefono, hasPassword: !!contrasena });
    
    const user = await User.findByPk(usuario_id);
    if (!user) {
      console.log('ERROR: Usuario no encontrado');
      return res.status(404).json({ 
        success: false, 
        msg: 'Usuario no encontrado en el sistema.'  // SIN EMOJI
      });
    }

    console.log('Usuario encontrado:', user.email);
    
    const updateData = {};
    const cambios = [];
    
    if (email && email !== user.email) {
      console.log('Cambiando email...');
      
      const existingUser = await User.findOne({ 
        where: { 
          email,
          usuario_id: { [Op.ne]: usuario_id }
        } 
      });
      
      if (existingUser) {
        console.log('ERROR: El email ya está en uso');
        return res.status(400).json({ 
          success: false, 
          msg: 'Este correo electrónico ya está en uso por otro usuario. Por favor, usa otro.'  // SIN EMOJI
        });
      }
      updateData.email = email;
      cambios.push('correo electrónico');
    }
    
    if (telefono !== undefined && telefono !== user.telefono) {
      console.log('Cambiando teléfono...');
      updateData.telefono = telefono;
      cambios.push('teléfono');
    }
    
    if (contrasena) {
      console.log('Cambiando contraseña...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasena, salt);
      updateData.contrasena = hashedPassword;
      cambios.push('contraseña');
    }

    if (Object.keys(updateData).length > 0) {
      console.log('Actualizando usuario...');
      await User.update(updateData, {
        where: { usuario_id }
      });
      console.log('Usuario actualizado');
    } else {
      console.log('No hay cambios');
      return res.status(200).json({
        success: true,
        msg: 'No se detectaron cambios para actualizar.',  // SIN EMOJI
        user: user
      });
    }

    const updatedUser = await User.findByPk(usuario_id, {
      attributes: { exclude: ['contrasena'] }
    });

    console.log('Perfil actualizado exitosamente');
    
    // Crear mensaje personalizado según los cambios
    let mensaje = '';
    if (cambios.length === 1) {
      mensaje = `${cambios[0].charAt(0).toUpperCase() + cambios[0].slice(1)} actualizado exitosamente.`;
    } else if (cambios.length > 1) {
      const ultimo = cambios.pop();
      mensaje = `${cambios.join(', ')} y ${ultimo} actualizados exitosamente.`;
    } else {
      mensaje = 'Perfil actualizado exitosamente.';
    }
    
    return res.status(200).json({
      success: true,
      msg: mensaje,  // SIN EMOJI
      user: updatedUser,
      cambios: cambios
    });

  } catch (error) {
    console.error('ERROR al actualizar perfil:', error);
    console.error('Stack trace:', error.stack);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        msg: 'Token de sesión inválido. Por favor, inicia sesión nuevamente.'  // SIN EMOJI
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        msg: 'Sesión expirada. Por favor, inicia sesión nuevamente.'  // SIN EMOJI
      });
    }
    
    return res.status(500).json({ 
      success: false, 
      msg: 'Error al guardar los cambios. Por favor, intenta nuevamente.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// --- GET /api/auth/check-token (Verificar token) ---
exports.checkToken = async (req, res) => {
  try {
    console.log('CHECK TOKEN REQUEST RECIBIDA');
    
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.log('No hay token');
      return res.status(401).json({ 
        valid: false, 
        msg: 'No hay token de sesión.'  // SIN EMOJI
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ['usuario_id', 'nombre', 'email', 'rol']
    });
    
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(401).json({ 
        valid: false, 
        msg: 'Usuario no encontrado.'  // SIN EMOJI
      });
    }
    
    console.log('Token válido para:', user.email);
    
    return res.status(200).json({
      valid: true,
      msg: 'Sesión válida.',  // SIN EMOJI
      user: {
        id: user.usuario_id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });
    
  } catch (error) {
    console.error('Token inválido:', error.message);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        valid: false, 
        msg: 'Sesión inválida o expirada. Por favor, inicia sesión nuevamente.'  // SIN EMOJI
      });
    }
    
    return res.status(500).json({ 
      valid: false, 
      msg: 'Error al verificar la sesión.'  // SIN EMOJI
    });
  }
};

// --- GET /api/auth/logout (Cerrar sesión - frontend maneja) ---
exports.logoutUser = async (req, res) => {
  try {
    console.log('LOGOUT REQUEST RECIBIDA');
    
    return res.status(200).json({
      success: true,
      msg: 'Sesión cerrada exitosamente. Vuelve pronto.'  // SIN EMOJI
    });
    
  } catch (error) {
    console.error('ERROR al cerrar sesión:', error);
    return res.status(500).json({
      success: false,
      msg: 'Error al cerrar sesión. Por favor, intenta nuevamente.'  // SIN EMOJI
    });
  }
};