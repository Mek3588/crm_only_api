
const { INTEGER, BOOLEAN, STRING, DATE } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");

const Document = sequelize.define("documents", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  originalName: {
    type: STRING,
    
  },
  type: {
    type: STRING,
    allowNull: false,
  },
  document: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: STRING,
  },
  active: {
    type: BOOLEAN,
  },
  code: {
    type: STRING,
  },
  userId: {
    type: INTEGER,
  },
  createdAt: {
    type: DATE,
  },
});

Document.belongsTo(User);
module.exports = Document;
