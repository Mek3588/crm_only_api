const { DOUBLE, STRING, NUMBER } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const Document = require("./Document")
const EmailDocument = sequelize.define("email_documents", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
     
    emailModelId: {
        type: INTEGER,
        allowNull: false
    },
    documentId: {
        type: STRING,
        allowNull: false
    },

})

module.exports = EmailDocument;