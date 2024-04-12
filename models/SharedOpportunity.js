const { STRING, UUID, UUIDV4, ARRAY } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const SharedOpporunity = sequelize.define("shared_opportunitys", {
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
  opportunityId: {
    type: INTEGER,
    allowNull: false,
  },
});
module.exports = SharedOpporunity;
