const { STRING,INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const EmailModel = require("./EmailModel");

const EmailModelDocument = sequelize.define("emailmodel_documents", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
       type: STRING,
        allowNull: false
    },
  
    emailModelId: {
        type: INTEGER,
        allowNull: false
    },
    document: {
        type: STRING,
        allowNull: false
    },
})

EmailModelDocument.belongsTo(EmailModel)
EmailModel.hasOne(EmailModelDocument)

module.exports = EmailModelDocument;