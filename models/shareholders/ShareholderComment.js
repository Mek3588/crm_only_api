
const sequelize = require("../../database/connections");
const {  INTEGER,STRING } = require("sequelize");
const User = require("../acl/user");
const Shareholder = require("./Shareholder");
const ShareholderComment = sequelize.define("shareholder_comments", {
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
    shareholderId: {
        type: INTEGER,
        allowNull: false,
    },
    userId: {
        type: INTEGER,
        allowNull: false,
    }

});
Shareholder.hasMany(ShareholderComment)
ShareholderComment.belongsTo(Shareholder)


ShareholderComment.belongsTo(User)
module.exports =  ShareholderComment