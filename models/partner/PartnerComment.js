
const sequelize = require("../../database/connections");
const {  INTEGER,STRING } = require("sequelize");
const User = require("../acl/user");
const Partner = require("./Partner");

const PartnerComment = sequelize.define("partner_comments", {
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
    partnerId: {
        type: INTEGER,
        allowNull: false,
    },
    userId: {
        type: INTEGER,
        allowNull: false, 
    }

});
Partner.hasMany(PartnerComment)
PartnerComment.belongsTo(Partner)


PartnerComment.belongsTo(User)
module.exports =  PartnerComment