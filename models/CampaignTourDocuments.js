

const { INTEGER } = require("sequelize");
const {Document} = require("./Document");
const sequelize = require("../database/connections");
const CampaignTour = require("./CampaignTour");


const CampaignTourDocument = sequelize.define("campaign_tour_documents", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    campaignsTourId: {
         type: INTEGER,
    },
    documentId: {
        type:INTEGER
    }
})


module.exports = CampaignTourDocument