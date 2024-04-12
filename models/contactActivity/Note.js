
const { STRING, INTEGER } = require("sequelize");
const User = require("../acl/user");
const sequelize = require("../../database/connections");
const Contact = require("../Contact");
const Employee = require("../Employee");

const Note = sequelize.define("contact_notes", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  note: {
    type: STRING,
    allowNull: false
  },
  comment: {
    type: STRING,
  },
  // createdDate: {
  //   type: STRING,
  //   allowNull: false
  // },
  userId: {
    type: INTEGER
  },
  reportTo: {
    type: INTEGER
  },
  targetId: {
    type: INTEGER
  },
  target: {
    type: STRING
  }

})
// Contact.hasMany(ContactNote)
// ContactNote.belongsTo(Contact)


User.hasMany(Note)
Note.belongsTo(User);

module.exports = Note