const express = require('express');
const router = express.Router();
const tratamientos = require("../controllers/tratamiento.controller.js");

// Crear un nuevo tratamiento
router.post("/", tratamientos.crear);

// Obtener todos los tratamientos
router.get("/", tratamientos.obtenerTodos);

// Buscar tratamientos por nombre
router.get("/buscar", tratamientos.buscar);

// Obtener un tratamiento por id
router.get("/:id", tratamientos.obtenerPorId);

// Actualizar un tratamiento por id
router.put("/:id", tratamientos.actualizar);

// Eliminar un tratamiento por id
router.delete("/:id", tratamientos.eliminar);

module.exports = router;
