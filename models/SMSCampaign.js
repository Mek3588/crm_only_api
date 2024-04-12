const sequelize = require("../database/connections");
const { STRING, INTEGER } = require("sequelize");
const User = require("./acl/user");
const Campaign = require("./Campaign");

const SMSCampaign = sequelize.define("sms_campaigns", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    content: {
        type: STRING,
        allowNull: false
    },
    userId: {
        type: INTEGER
    },
    campaignId: {
        type: INTEGER
    },
    isLeadSms: {
        type: Boolean
    },
    isAccountSms: {
        type: Boolean
    },
    isCustomerSms: {
        type: Boolean
    },
    owner: {
        type: STRING,
    },
})
SMSCampaign.belongsTo(User)
Campaign.hasMany(SMSCampaign)
SMSCampaign.belongsTo(Campaign, { foreignKey: 'campaignId' });
// SMSCampaign.belongsTo(Campaign); 
module.exports = SMSCampaign;