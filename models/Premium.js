const { STRING, BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const Premium = sequelize.define("premiums", {
    subject: {
        type: STRING,
        allowNull: true
    },
    opportunityId: {
        type: INTEGER
    },
    assignedTo: {
        type: INTEGER
    }, 
    leadId: {
        type: INTEGER
    },
    expiration_date:{
        type: STRING,
        allowNull: false
    },
    productId: {
        type: INTEGER
    },
})