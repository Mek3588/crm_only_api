const { STRING, UUID, UUIDV4, ARRAY } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const SharedPeople = sequelize.define("shared_people", {
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
});
module.exports = SharedPeople;
