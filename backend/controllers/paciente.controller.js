const db = require("../models");
const Paciente = db.pacientes;
const HistorialTratamiento = db.historialTratamientos;
const Tratamiento = db.tratamientos;
const { Op } = require("sequelize");

// Crear y guardar un nuevo paciente
exports.crear = async (req, res) => {
    try {
        // Validar la solicitud
        if (!req.body.nombre || !req.body.rut || !req.body.fechaNacimiento) {
            return res.status(400).json({
                mensaje: "El nombre, RUT y fecha de nacimiento son campos requeridos!"
            });
        }

        // Crear un paciente
        const paciente = {
            nombre: req.body.nombre,
            rut: req.body.rut,
            fechaNacimiento: req.body.fechaNacimiento,
            telefono: req.body.telefono,
            patologias: req.body.patologias,
            enfermedadesDiagnosticadas: req.body.enfermedadesDiagnosticadas,
            motivoConsulta: req.body.motivoConsulta,
            notas: req.body.notas || "",
        activo: true
    };

    // Guardar paciente en la base de datos
    const data = await Paciente.create(paciente);
    res.status(201).json(data);
} catch (err) {
    res.status(500).json({
        mensaje: err.message || "Ocurrió un error al crear el paciente."
    });
}
};
// Obtener todos los pacientes
exports.obtenerTodos = async (req, res) => {
    try {
        const data = await Paciente.findAll({
            where: { activo: true }
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({
            mensaje: err.message || "Ocurrió un error al obtener los pacientes."
        });
    }
};

// Encontrar un paciente por id con su historial de tratamientos
exports.obtenerPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Paciente.findByPk(id, {
            include: [{
                model: HistorialTratamiento,
                as: 'historialTratamientos',
                include: [{
                    model: Tratamiento,
                    as: 'tratamiento'
                }]
            }]
        });
        
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({
                mensaje: `No se encontró el paciente con id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).json({
            mensaje: "Error al obtener el paciente con id=" + req.params.id
        });
    }
};

// Actualizar un paciente por id
exports.actualizar = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Paciente.update(req.body, {
            where: { id: id }
        });

        if (num[0] === 1) {
            res.json({
                mensaje: "Paciente actualizado exitosamente."
            });
        } else {
            res.status(404).json({
                mensaje: `No se pudo actualizar el paciente con id=${id}. Tal vez el paciente no fue encontrado o el body está vacío!`
            });
        }
    } catch (err) {
        res.status(500).json({
            mensaje: "Error al actualizar el paciente con id=" + id
        });
    }
};

// Eliminar un paciente por id (eliminación suave)
exports.eliminar = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Paciente.update({ activo: false }, {
            where: { id: id }
        });

        if (num[0] === 1) {
            res.json({
                mensaje: "Paciente eliminado exitosamente!"
            });
        } else {
            res.status(404).json({
                mensaje: `No se pudo eliminar el paciente con id=${id}. Tal vez el paciente no fue encontrado!`
            });
        }
    } catch (err) {
        res.status(500).json({
            mensaje: "Error al eliminar el paciente con id=" + id
        });
    }
};

// Buscar pacientes por nombre
exports.buscar = async (req, res) => {
    try {
        const nombre = req.query.nombre;
        const condicion = nombre ? { 
            nombre: { [Op.like]: `%${nombre}%` },
            activo: true
        } : { activo: true };

        const data = await Paciente.findAll({ where: condicion });
        res.json(data);
    } catch (err) {
        res.status(500).json({
            mensaje: err.message || "Ocurrió un error al buscar los pacientes."
        });
    }
};

// Agregar un tratamiento al historial del paciente
exports.agregarTratamiento = async (req, res) => {
    try {
        const { pacienteId, tratamientoId, fecha, valor, pagado, comentarios } = req.body;

        if (!pacienteId || !tratamientoId || !fecha || !valor) {
            return res.status(400).json({
                mensaje: "Faltan campos requeridos (pacienteId, tratamientoId, fecha, valor)"
            });
        }

        const historial = await HistorialTratamiento.create({
            pacienteId,
            tratamientoId,
            fecha,
            valor,
            pagado: pagado || false,
            comentarios
        });

        res.status(201).json(historial);
    } catch (err) {
        res.status(500).json({
            mensaje: err.message || "Ocurrió un error al agregar el tratamiento al historial."
        });
    }
};

// Obtener historial de tratamientos de un paciente
exports.obtenerHistorial = async (req, res) => {
    try {
        const pacienteId = req.params.id;
        const historial = await HistorialTratamiento.findAll({
            where: { pacienteId },
            include: [{
                model: Tratamiento,
                as: 'tratamiento'
            }],
            order: [['fecha', 'DESC']]
        });

        res.json(historial);
    } catch (err) {
        res.status(500).json({
            mensaje: err.message || "Ocurrió un error al obtener el historial del paciente."
        });
    }
};

// Actualizar estado de pago de un tratamiento
exports.actualizarPago = async (req, res) => {
    try {
        const { historialId } = req.params;
        const { pagado } = req.body;

        const historial = await HistorialTratamiento.findByPk(historialId);
        if (!historial) {
            return res.status(404).json({
                mensaje: "No se encontró el registro de historial especificado."
            });
        }

        await historial.update({ pagado });
        res.json({ mensaje: "Estado de pago actualizado exitosamente." });
    } catch (err) {
        res.status(500).json({
            mensaje: err.message || "Error al actualizar el estado de pago."
        });
    }
};
