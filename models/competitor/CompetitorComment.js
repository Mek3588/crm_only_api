
const sequelize = require("../../database/connections");
const {  INTEGER,STRING } = require("sequelize");
const User = require("../acl/user");

const Competitor = require("./Competitors");
const CompetitorComment = sequelize.define("competitor_comments", {
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
    competitorId: {
        type: INTEGER,
        allowNull: false,
    },
    userId: {
        type: INTEGER,
        allowNull: false,
    }

});
Competitor.hasMany(CompetitorComment)
CompetitorComment.belongsTo(Competitor)


CompetitorComment.belongsTo(User)
module.exports =  CompetitorComment