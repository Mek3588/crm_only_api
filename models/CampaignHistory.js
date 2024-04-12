const { STRING, DOUBLE ,INTEGER} = require("sequelize");
const sequelize = require("../database/connections");
const Campaign = require("./Campaign");
const CampaignHistory = sequelize.define("campaign_historys", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    campaignId: {
        type: INTEGER,
    },
    previousStartingDate: {
        type: STRING,
    },
    previousEndingDate: {
        type: STRING,
    },
    currentStartingDate: {
        type: STRING,
    },
    currentEndingDate: {
        type: STRING,
    },
})
Campaign.hasMany(CampaignHistory)
CampaignHistory.belongsTo(Campaign)
module.exports = CampaignHistory
