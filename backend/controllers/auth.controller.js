const db = require("../models");
const Usuario = db.usuarios;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "medicina-alternativa-secret-key-2024";

// Registrar un nuevo usuario
exports.registro = async (req, res) => {
    try {
        // Validar la solicitud
        if (!req.body.email || !req.body.password || !req.body.nombre) {
            return res.status(400).json({
                mensaje: "El email, contraseña y nombre son campos requeridos!"
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({
            where: { email: req.body.email }
        });

        if (usuarioExistente) {
            return res.status(400).json({
                mensaje: "El correo electrónico ya está registrado!"
            });
        }

        // Crear un usuario
        const usuario = await Usuario.create({
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8),
            nombre: req.body.nombre,
            activo: true
        });
        
        // Enviar respuesta exitosa
        res.status(201).json({
            mensaje: "Usuario registrado exitosamente!",
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre: usuario.nombre
            }
        });
    } catch (err) {
        console.error("Error en registro:", err);
        res.status(500).json({
            mensaje: "Error al registrar el usuario."
        });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    try {
        console.log("Intento de login con:", req.body.email);
        
        // Validar la solicitud
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({
                mensaje: "Email y contraseña son requeridos!"
            });
        }

        const usuario = await Usuario.findOne({
            where: {
                email: req.body.email,
                activo: true
            }
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: "Credenciales inválidas."
            });
        }

        const passwordValido = bcrypt.compareSync(
            req.body.password,
            usuario.password
        );

        if (!passwordValido) {
            return res.status(401).json({
                mensaje: "Credenciales inválidas."
            });
        }

        // Crear token
        const token = jwt.sign(
            { id: usuario.id },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        console.log("Login exitoso para:", usuario.email);

        // Enviar respuesta con token
        res.status(200).json({
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre,
            accessToken: token
        });
    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({
            mensaje: "Error al iniciar sesión."
        });
    }
};

// Verificar token
exports.verificarToken = (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];

    // Remover "Bearer " si existe
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7);
    }

    if (!token) {
        console.log("No se proporcionó token");
        return res.status(403).json({
            mensaje: "No se proporcionó token!"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (err) {
        console.error("Error al verificar token:", err);
        return res.status(401).json({
            mensaje: "Token inválido o expirado!"
        });
    }
};

// Obtener perfil del usuario actual
exports.perfil = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.userId);
        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado."
            });
        }

        res.status(200).json({
            id: usuario.id,
            email: usuario.email,
            nombre: usuario.nombre
        });
    } catch (err) {
        console.error("Error al obtener perfil:", err);
        res.status(500).json({
            mensaje: "Error al obtener el perfil del usuario."
        });
    }
};
