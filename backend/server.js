const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");
const auth = require("./controllers/auth.controller");

const app = express();

// Configuración de CORS
app.use(cors());

// Parse requests de content-type - application/json
app.use(express.json());

// Parse requests de content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../')));

// Rutas públicas
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin/login.html"));
});

// Ruta del dashboard (NO protegida - la protección se hace en el frontend)
app.get("/admin/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin/dashboard.html"));
});

// Rutas de autenticación (públicas)
app.use("/api/auth", require("./routes/auth.routes"));

// Middleware para proteger rutas de la API
const protegerRuta = auth.verificarToken;

// Rutas de la API (protegidas)
app.use("/api/tratamientos", protegerRuta, require("./routes/tratamiento.routes"));
app.use("/api/pacientes", protegerRuta, require("./routes/paciente.routes"));

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        mensaje: "¡Algo salió mal!",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Puerto
const PORT = process.env.PORT || 8000;

// Sincronizar base de datos y luego iniciar el servidor
db.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`El servidor está corriendo en el puerto ${PORT}.`);
            console.log(`- Accede a la landing page en: http://localhost:${PORT}`);
            console.log(`- Accede al panel de administración en: http://localhost:${PORT}/admin`);
            console.log(`- Credenciales por defecto:`);
            console.log(`  Email: admin@clinica.com`);
            console.log(`  Contraseña: admin123`);
        });
    })
    .catch(err => {
        console.error("Error al inicializar la base de datos:", err);
    });

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing HTTP server.');
    server.close(() => {
        console.log('HTTP server closed.');
        // Cerrar conexión con la base de datos
        db.sequelize.close();
    });
});
