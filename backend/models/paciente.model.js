module.exports = (sequelize, Sequelize) => {
    const Paciente = sequelize.define("paciente", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rut: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
            validate: {
                // Formato RUT chileno (XX.XXX.XXX-X)
                is: /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$/
            }
        },
        fechaNacimiento: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        telefono: {
            type: Sequelize.STRING,
            allowNull: true
        },
        patologias: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        enfermedadesDiagnosticadas: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        motivoConsulta: {
            type: Sequelize.TEXT,
            allowNull: true
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

    return Paciente;
};
