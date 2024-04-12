const { STRING, INTEGER } = require("sequelize");
const User = require("../acl/user");
const sequelize = require("../../database/connections");
const Contact = require("../Contact");

const AccountNote = sequelize.define("account_notes", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  note:{
    type: STRING,
    allowNull:false
  },
  comment:{
    type:STRING,
    
  },
  createdDate: {
        type: STRING,
        allowNull: false
    },
  userId:{
    type:INTEGER
  },
  contactId: {
    type:INTEGER
  }

})

Contact.hasMany(AccountNote)
AccountNote.belongsTo(Contact)

User.hasMany(AccountNote)
AccountNote.belongsTo(User); 

  module.exports = AccountNote