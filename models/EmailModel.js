const { STRING,INTEGER,TEXT } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const Document = require("./Document");
const EmailDocument = require("./EmailDocument");
const EmailModel = sequelize.define("email_models", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: INTEGER,
        allowNull: false
    },
    subject: {
        type: STRING,
        allowNull: false
    },
    message: {
        type: TEXT,
        allowNull: false
    },
})

EmailModel.belongsTo(User)


EmailModel.belongsToMany(Document, { through: EmailDocument })
Document.belongsToMany(EmailModel, { through: EmailDocument})

EmailModel.belongsTo(User)
module.exports = EmailModel;