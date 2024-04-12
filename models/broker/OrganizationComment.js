
const sequelize = require("../../database/connections");
const {  INTEGER,STRING } = require("sequelize");
const User = require("../acl/user");
const Organization = require("./Organization");
const OrganizationComment = sequelize.define("organization_comments", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    Comment: {
        type: STRING,
        allowNull: false,
    },
    organizationId: {
        type: INTEGER,
        allowNull: false,
    },
    userId: {
        type: INTEGER,
        allowNull: false,
    }

});
Organization.hasMany(OrganizationComment)
OrganizationComment.belongsTo(Organization)


OrganizationComment.belongsTo(User)
module.exports =  OrganizationComment