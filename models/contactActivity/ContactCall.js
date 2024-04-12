const { STRING, INTEGER } = require("sequelize");
const User = require("../acl/user");
const sequelize = require("../../database/connections");
const Contact = require("../Contact");

const Call = sequelize.define("contact_calls", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  callType: {
    type: STRING,
    allowNull: false,
  },
  topic: {
    type: STRING,
    allowNull: false,
  },
  callHours: {
    type: STRING,
  },
  callMinutes: {
    type: STRING,
  },
  callHours: {
    type: STRING,
  },
  callMinutes: {
    type: STRING,
  },
  userId: {
    type: INTEGER,
  },
  targetId: {
    type: INTEGER,
  },
  target: {
    type: STRING,
  },
  createdDate: {
    type: STRING,
    allowNull: false,
  },
});
// Contact.hasMany(Call)
// Call.belongsTo(Contact)

User.hasMany(Call);
Call.belongsTo(User);

module.exports = Call;
