const {INTEGER} = require("sequelize");
const sequelize = require("../database/connections");
const CampaignTour = require("./CampaignTour");
const SalesPerson = require("./SalesPerson");


const CampaignTourMembers = sequelize.define("campaign_tour_members", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
     campaignsTourId: {
         type: INTEGER,
        },
      employeeId: {
         type: INTEGER,
      },
})



module.exports =  CampaignTourMembers