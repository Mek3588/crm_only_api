const { STRING, INTEGER } = require("sequelize");
const Contact = require("../Contact");
const sequelize = require("../../database/connections");
const User = require("../acl/user");
const Employee = require("../Employee");
const ContactTaskEmployee = require("../ContactTaskEmployee");
const ContactTask = sequelize.define("contact_tasks", {
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
  assignedTo:{
    type: INTEGER
  },
  targetId: {
    type:INTEGER
  },
  target: {
    type: STRING
  }
})
// Contact.hasMany(ContactTask)
// ContactTask.belongsTo(Contact)
ContactTask.belongsTo(Contact, {
  foreignKey: "targetId",
  as: "contact",
});

User.hasMany(ContactTask)
ContactTask.belongsTo(User); 

Employee.belongsToMany(ContactTask, { through: ContactTaskEmployee });
ContactTask.belongsToMany(Employee, { through: ContactTaskEmployee });

  module.exports = ContactTask