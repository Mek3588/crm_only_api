const { STRING, INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const User = require("./acl/user");

const CommunicationHistory = sequelize.define("comunication_histories", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  contactId: {
    type: INTEGER,
    allowNull: false,
  },
  type: {
    type: STRING,
    allowNull: false
  },
  subject: {
    type: STRING,
  },
  content: {
    type: STRING,
    allowNull: false,
  },
  attachments: {
    type: STRING,
  },
});
// UpdateHistory.belongsTo(Contact);
// Contact.hasMany(UpdateHistory);
// User.hasMany(UpdateHistory);
CommunicationHistory.belongsTo(User);

module.exports = CommunicationHistory;
