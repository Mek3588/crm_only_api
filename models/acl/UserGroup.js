
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const UserGroup = sequelize.define("user_groups", {
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
    groupId: {
        type: INTEGER,
        allowNull: false,
    }

});
module.exports =  UserGroup