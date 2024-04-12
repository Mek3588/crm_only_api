const Sequelize = require("sequelize");

module.exports = new Sequelize("crm_development", "etech", "etech@2030", {
    host: "10.10.20.44",

    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})
