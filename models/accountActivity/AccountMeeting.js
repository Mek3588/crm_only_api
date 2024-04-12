const { STRING, INTEGER } = require("sequelize");
const User = require("../acl/user");
const Contact = require("../Contact");
const sequelize = require("../../database/connections");

const AccountMeeting = sequelize.define("account_meetings", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    outCome: {
        type: STRING,
        allowNull: false,
    },
    date: {
        type: STRING,
        allowNull: false
    },
    createdDate: {
        type: STRING,
        allowNull: false
    },
    time: {
        type: STRING,
        allowNull: false
    },
    duration: {
        type: STRING,
    },
    status: {
        type: STRING,
    },
    note: {
        type:STRING
    },
    reportTo:{
        type:INTEGER
    },
    userId:{
        type:INTEGER
    },
    
    contactId: {
        type:INTEGER
     }

})

Contact.hasMany(AccountMeeting)
AccountMeeting.belongsTo(Contact)

User.hasMany(AccountMeeting)
AccountMeeting.belongsTo(User); 

module.exports = AccountMeeting

