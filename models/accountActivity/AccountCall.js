const { STRING, INTEGER } = require("sequelize");
const User = require("../acl/user");
const sequelize = require("../../database/connections");
const Contact = require("../Contact");

const AccountCall = sequelize.define("account_calls", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    callType: {
        type: STRING,
        allowNull:false
    },
    topic: {
        type: STRING,
        allowNull: false
    },
    date: {
        type: STRING,
        allowNull: false
    },
    createdDate: {
        type: STRING,
        allowNull: false
    },
    callDuration: {
        type: STRING
    },
    userId: {
        type:INTEGER
    },
    contactId: {
        type:INTEGER
    }


})
Contact.hasMany(AccountCall)
AccountCall.belongsTo(Contact)

User.hasMany(AccountCall)
AccountCall.belongsTo(User); 



module.exports = AccountCall