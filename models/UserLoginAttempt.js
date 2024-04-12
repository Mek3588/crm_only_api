const { STRING, BOOLEAN, INTEGER, DATE } = require("sequelize");
const sequelize = require("../database/connections");
const UserLoginAttempt = sequelize.define("user_login_attempts", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: STRING,
  },
  phone: {
    type: STRING,
  },
  ipAddress: {
    type: STRING,
    allowNull: false,
  },
  attemptCount: {
    type: INTEGER,
    allowNull: false,
  },
  lastAttempt: {
    type: DATE,
    allowNull: false,
  },
  locked: {
    type: BOOLEAN,
    defaultValue: false,
  },
});

module.exports = UserLoginAttempt;
