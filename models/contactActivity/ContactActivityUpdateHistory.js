const { STRING, INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");

const ContactActivityUpdate = sequelize.define("contact_activity_update_histories", {
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
  activity: {
    type: STRING,
    allowNull: false
  },
  attribute: {
    type: STRING,
    allowNull: false
  },
  previous_status: {
    type: STRING,
    allowNull: false,
  },
  current_status: {
    type: STRING,
    allowNull: false,
  },
});
// UpdateHistory.belongsTo(Contact);
// Contact.hasMany(UpdateHistory);
// User.hasMany(UpdateHistory);
ContactActivityUpdate.belongsTo(User);

module.exports = ContactActivityUpdate;
