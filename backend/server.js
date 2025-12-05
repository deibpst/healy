// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');

// RUTA CORREGIDA: usa ruta relativa correcta
const User = require('./models/user'); 
const authRoutes = require('./routes/authRoutes');

// Librería oficial de Google
const { google } = require('googleapis');

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

// Sincronizar con alter: true para agregar nuevas columnas sin perder datos
sequelize.sync({ alter: true }).then(() => {
    console.log('📋 Modelos sincronizados con la DB.');
}).catch(err => {
    console.error('❌ Error al sincronizar modelos:', err);
});

// Definición de Rutas
app.use('/api/auth', authRoutes);

// ---------------- GOOGLE OAUTH2 CONFIG ----------------
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Ruta para iniciar login con Google (solo fisioterapeuta)
app.get('/api/auth/google', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
    });
    res.redirect(url);
});

// Callback de Google OAuth
app.get('/api/auth/google/callback', async (req, res) => {
    try {
        const { code } = req.query;
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // 🔑 Guardar refresh_token en la DB (ejemplo simple)
        if (tokens.refresh_token) {
            // Aquí deberías identificar al fisioterapeuta logeado (ej. con sesión/JWT)
            // Para simplificar, supongamos que guardas el refresh_token en el primer usuario fisioterapeuta
            const fisio = await User.findOne({ where: { rol: 'fisioterapeuta' } });
            if (fisio) {
                await fisio.update({ google_refresh_token: tokens.refresh_token });
                console.log('✅ Refresh token guardado en DB');
            }
        }

        console.log('✅ Tokens de Google obtenidos:', tokens);

        res.redirect('http://localhost:3000/calendar'); // redirige al calendario del frontend
    } catch (error) {
        console.error('❌ Error en Google OAuth:', error);
        res.status(500).send('Error al conectar con Google Calendar');
    }
});
// ------------------------------------------------------

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor Healy Backend funcionando!');
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});