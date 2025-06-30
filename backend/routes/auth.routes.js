const express = require('express');
const router = express.Router();
const auth = require("../controllers/auth.controller.js");

// Registro de nuevo usuario (ruta protegida, solo para desarrollo)
router.post("/registro", auth.registro);

// Inicio de sesión
router.post("/login", auth.login);

// Obtener perfil del usuario actual (ruta protegida)
router.get("/perfil", auth.verificarToken, auth.perfil);

module.exports = router;
