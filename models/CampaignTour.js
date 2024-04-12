const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const Document = require('./Document')
const SalesPerson = require("./SalesPerson");
const CampaignTourMembers = require("./CampaignTourMembers");
const CampaignTourDocument = require("./CampaignTourDocuments");
const Campaign = require("./Campaign");
const Employee = require("./Employee");

const CampaignTour = sequelize.define("campaigns_tours", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    //leader
   
    visitDate: {
         type: STRING,
         allowNull: false,
    }, 
    sector: {
         type: STRING,
         allowNull: false,
    },
    campaignId: {
        type: STRING
    }
     
    
})
Campaign.hasMany(CampaignTour);
CampaignTour.belongsTo(Campaign); 

CampaignTour.belongsToMany(Employee, { through: CampaignTourMembers })
Employee.belongsToMany(CampaignTour, { through: CampaignTourMembers})

Document.belongsToMany(CampaignTour, { through: CampaignTourDocument})
CampaignTour.belongsToMany(Document, { through: CampaignTourDocument })


module.exports = CampaignTour