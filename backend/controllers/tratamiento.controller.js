const db = require("../models");
const Tratamiento = db.tratamientos;
const { Op } = require("sequelize");

// Crear y guardar un nuevo tratamiento
exports.crear = async (req, res) => {
    try {
        // Validar la solicitud
        if (!req.body.nombre || !req.body.precio) {
            return res.status(400).json({
                mensaje: "El nombre y precio son campos requeridos!"
            });
        }

        // Crear un tratamiento
        const tratamiento = {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            activo: true
        };

        // Guardar tratamiento en la base de datos
        const data = await Tratamiento.create(tratamiento);
        res.status(201).json(data);
    } catch (err) {
        res.status(500).json({
            mensaje: err.message || "Ocurrió un error al crear el tratamiento."
        });
    }
};

// Obtener todos los tratamientos
exports.obtenerTodos = async (req, res) => {
    try {
        const data = await Tratamiento.findAll({
            where: { activo: true }
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({
            mensaje: err.message || "Ocurrió un error al obtener los tratamientos."
        });
    }
};

// Encontrar un tratamiento por id
exports.obtenerPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Tratamiento.findByPk(id);
        
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({
                mensaje: `No se encontró el tratamiento con id=${id}.`
            });
        }
    } catch (err) {
        res.status(500).json({
            mensaje: "Error al obtener el tratamiento con id=" + req.params.id
        });
    }
};

// Actualizar un tratamiento por id
exports.actualizar = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Tratamiento.update(req.body, {
            where: { id: id }
        });

        if (num[0] === 1) {
            res.json({
                mensaje: "Tratamiento actualizado exitosamente."
            });
        } else {
            res.status(404).json({
                mensaje: `No se pudo actualizar el tratamiento con id=${id}. Tal vez el tratamiento no fue encontrado o el body está vacío!`
            });
        }
    } catch (err) {
        res.status(500).json({
            mensaje: "Error al actualizar el tratamiento con id=" + id
        });
    }
};

// Eliminar un tratamiento por id (eliminación suave)
exports.eliminar = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Tratamiento.update({ activo: false }, {
            where: { id: id }
        });

        if (num[0] === 1) {
            res.json({
                mensaje: "Tratamiento eliminado exitosamente!"
            });
        } else {
            res.status(404).json({
                mensaje: `No se pudo eliminar el tratamiento con id=${id}. Tal vez el tratamiento no fue encontrado!`
            });
        }
    } catch (err) {
        res.status(500).json({
            mensaje: "Error al eliminar el tratamiento con id=" + id
        });
    }
};

// Buscar tratamientos por nombre
exports.buscar = async (req, res) => {
    try {
        const nombre = req.query.nombre;
        const condicion = nombre ? { 
            nombre: { [Op.like]: `%${nombre}%` },
            activo: true
        } : { activo: true };

        const data = await Tratamiento.findAll({ where: condicion });
        res.json(data);
    } catch (err) {
        res.status(500).json({
            mensaje: err.message || "Ocurrió un error al buscar los tratamientos."
        });
    }
};
