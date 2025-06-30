module.exports = (sequelize, Sequelize) => {
    const Tratamiento = sequelize.define("tratamiento", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        descripcion: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        precio: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false
        },
        activo: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
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

    return Tratamiento;
};
