const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const ACL = require("./ACL");
const User = require("./user");
const UserGroup = require("./UserGroup");

const Group = sequelize.define("groups", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: STRING,
    allowNull: false,
  },
});

Group.belongsToMany(User, { through: UserGroup });
User.belongsToMany(Group, { through: UserGroup });

// User.hasMany(UserGroup);
// UserGroup.belongsTo(User);

module.exports = Group;
