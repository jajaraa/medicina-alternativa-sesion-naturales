const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
    dialect: dbConfig.dialect,
    storage: dbConfig.storage,
    logging: dbConfig.logging,
    define: dbConfig.define,
    pool: dbConfig.pool
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.tratamientos = require("./tratamiento.model.js")(sequelize, Sequelize);
db.pacientes = require("./paciente.model.js")(sequelize, Sequelize);
db.historialTratamientos = require("./historial.model.js")(sequelize, Sequelize);
db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);

// Establecer relaciones
db.pacientes.hasMany(db.historialTratamientos, {
    foreignKey: 'pacienteId',
    as: 'historialTratamientos'
});

db.tratamientos.hasMany(db.historialTratamientos, {
    foreignKey: 'tratamientoId',
    as: 'historialTratamientos'
});

db.historialTratamientos.belongsTo(db.pacientes, {
    foreignKey: 'pacienteId',
    as: 'paciente'
});

db.historialTratamientos.belongsTo(db.tratamientos, {
    foreignKey: 'tratamientoId',
    as: 'tratamiento'
});

// Función para sincronizar todos los modelos con la base de datos
db.sync = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log("Base de datos sincronizada correctamente.");

        // Crear usuario administrador por defecto si no existe
        const adminEmail = "admin@clinica.com";
        const bcrypt = require("bcryptjs");
        
        const adminExists = await db.usuarios.findOne({
            where: { email: adminEmail }
        });

        if (!adminExists) {
            await db.usuarios.create({
                email: adminEmail,
                password: bcrypt.hashSync("admin123", 8),
                nombre: "Administrador",
                activo: true
            });
            console.log("Usuario administrador creado exitosamente.");
        }
    } catch (error) {
        console.error("Error al sincronizar la base de datos:", error);
        throw error;
    }
};

module.exports = db;
