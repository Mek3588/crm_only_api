const { STRING, INTEGER } = require("sequelize");
const Contact = require("../Contact");
const sequelize = require("../../database/connections");
const User = require("../acl/user"); 
const AccountTask = sequelize.define("account_tasks", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

  task:{
    type:STRING,
    allowNull: false
  },
  

  dueDate:{
    type:STRING,
    allowNull: false
  },
createdDate: {
        type: STRING,
        allowNull: false
    },

  note:{
    type: STRING,
    
  },
  userId:{
    type: INTEGER
  },
  contactId: {
    type:INTEGER
  }

})

Contact.hasMany(AccountTask)
AccountTask.belongsTo(Contact)

User.hasMany(AccountTask)
AccountTask.belongsTo(User); 

  module.exports = AccountTask