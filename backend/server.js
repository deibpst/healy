// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

// RUTA CORREGIDA: Acceso directo a modelos y rutas dentro de la carpeta backend
const User = require('./models/User'); 
const authRoutes = require('./routes/authRoutes');

// Inicialización de Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000'], // Permite la comunicación con tu frontend Next.js
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Conectar a DB y Sincronizar modelos
connectDB();
// Sincroniza la tabla. En desarrollo, puedes usar { force: true } para borrar y recrear.
sequelize.sync().then(() => {
    console.log('📋 Modelos sincronizados con la DB.');
}).catch(err => {
    console.error('❌ Error al sincronizar modelos:', err);
});


// Definición de Rutas
app.use('/api/auth', authRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor Healy Backend funcionando!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});