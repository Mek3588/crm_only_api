const { STRING, DOUBLE ,INTEGER} = require("sequelize");
const sequelize = require("../database/connections");
const Campaign = require("./Campaign");
const CampaignEvent = sequelize.define("campaign_events", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    type: {
        type: STRING,
        allowNull:false
    },
    startingDate: {
        type: STRING,
        allowNull:false
    },
    endingDate: {
        type: STRING,
        allowNull:false
    },
    remark:{
        type: STRING
        
    },
    campaignId: {
        type: STRING
    }
})
Campaign.hasMany(CampaignEvent)
CampaignEvent.belongsTo(Campaign); 

module.exports = CampaignEvent