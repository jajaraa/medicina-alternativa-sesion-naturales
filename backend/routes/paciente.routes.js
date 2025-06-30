const express = require('express');
const router = express.Router();
const pacientes = require("../controllers/paciente.controller.js");

// Crear un nuevo paciente
router.post("/", pacientes.crear);

// Obtener todos los pacientes
router.get("/", pacientes.obtenerTodos);

// Buscar pacientes por nombre
router.get("/buscar", pacientes.buscar);

// Obtener un paciente por id (incluye historial)
router.get("/:id", pacientes.obtenerPorId);

// Actualizar un paciente por id
router.put("/:id", pacientes.actualizar);

// Eliminar un paciente por id
router.delete("/:id", pacientes.eliminar);

// Rutas para el historial de tratamientos
// Agregar un tratamiento al historial del paciente
router.post("/:id/tratamientos", pacientes.agregarTratamiento);

// Obtener historial de tratamientos de un paciente
router.get("/:id/historial", pacientes.obtenerHistorial);

// Actualizar estado de pago de un tratamiento
router.put("/historial/:historialId/pago", pacientes.actualizarPago);

module.exports = router;
