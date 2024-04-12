const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const Group = require("./Group");

const ACL = sequelize.define("acls", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  groupId: {
    type: INTEGER,
    allowNull: false,
  },
  path: {
    type: STRING,
    allowNull: false,
  },
  canCreate: {
    type: BOOLEAN,
    allowNull: false,
  },
  canRead: {
    type: BOOLEAN,
    allowNull: false,
  },
  canEdit: {
    type: BOOLEAN,
    allowNull: false,
  },
  canDelete: {
    type: BOOLEAN,
    allowNull: false,
  },
  onlyMyBranch: {
    type: BOOLEAN,
    allowNull: false,
  },
  onlySelf: {
    type: BOOLEAN,
    allowNull: false,
  },
});

ACL.belongsTo(Group, {foreignKey: "groupId", as: "groups"});
Group.hasMany(ACL, {as: "acls"});

module.exports = ACL;
