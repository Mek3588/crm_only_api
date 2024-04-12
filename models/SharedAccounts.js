const { STRING, UUID, UUIDV4, ARRAY } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const SharedAccounts = sequelize.define("shared_accounts", {
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
  accountId: {
    type: INTEGER,
    allowNull: false,
  },
});
module.exports = SharedAccounts;
