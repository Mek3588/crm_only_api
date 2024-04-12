const { INTEGER } = require("sequelize");

const sequelize = require("../database/connections");

const ContactTaskEmployee = sequelize.define("contact_taskes_employees", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,  
    primaryKey: true,
    },

    employeeId: {
        type: INTEGER,
        allowNull: false
    },

    contactTaskId: {
        type: INTEGER,
        allowNull: false
    }

    
})
    
    module.exports = ContactTaskEmployee