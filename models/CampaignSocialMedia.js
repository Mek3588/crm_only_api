const { STRING, INTEGER} = require("sequelize");
const sequelize = require("../database/connections");
const Campaign = require("./Campaign");
const CampaignSocialMedia = sequelize.define("campaign_socialmedias", {
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

Campaign.hasMany(CampaignSocialMedia)
CampaignSocialMedia.belongsTo(Campaign); 

module.exports = CampaignSocialMedia