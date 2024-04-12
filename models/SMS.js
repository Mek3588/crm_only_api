const sequelize = require("../database/connections");
const { STRING,INTEGER } = require("sequelize");
const User = require("./acl/user");

const SMS = sequelize.define("sms_messages", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  content: {
    type: STRING(400),
    allowNull: false,
  },
  userId: {
    type: INTEGER,
  },
});
SMS.belongsTo(User)
module.exports = SMS;