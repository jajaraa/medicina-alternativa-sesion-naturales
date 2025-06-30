require('dotenv').config();

module.exports = {
  dialect: "sqlite",
  storage: "./database.sqlite",
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
