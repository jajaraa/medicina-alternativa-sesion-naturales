module.exports = (sequelize, Sequelize) => {
    const HistorialTratamiento = sequelize.define("historial_tratamiento", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        pacienteId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'pacientes',
                key: 'id'
            }
        },
        tratamientoId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'tratamientos',
                key: 'id'
            }
        },
        fecha: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        valor: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        pagado: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        comentarios: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        createdAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    });

    return HistorialTratamiento;
};
