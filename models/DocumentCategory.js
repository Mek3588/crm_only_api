const { STRING, INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");

const DocumentCategory = sequelize.define("document_category", {
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
  description: {
    type: STRING,
    },
    userId: {
      type:INTEGER
  }
});
// sequelize.sync({ alter: true });
DocumentCategory.belongsTo(User);

module.exports = DocumentCategory;
