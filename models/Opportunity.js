const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const Campaign = require("./Campaign");
const Contact = require("./Contact");
const Employee = require("./Employee");
const VehicleCategory = require("./motor/VehicleCategory");
const SharedOpporunity = require("./SharedOpportunity");
const FireRateCategory = require("./fire/FireRateCategory");
const Vehicle = require("./motor/Vehicle");

const Opportunity = sequelize.define("opportunitys", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  subject: {
    type: STRING,
    allowNull: false,
  },
  assignedTo: {
    type: INTEGER,
    allowNull: false,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  probablity: {
    type: INTEGER,
    allowNull: false,
  },
  accountId: {
    type: INTEGER,
    allowNull: false,
  },
  productId: {
    type: INTEGER,
  },
  fire_productId: {
    type: INTEGER,
  },
  status: {
    type: STRING,
  },
  source: {
    type: STRING,
  },
  description: {
    type: STRING,
  },
  campaignId: {
    type: INTEGER,
  },
});

Opportunity.belongsTo(User);
Opportunity.belongsTo(User, { foreignKey: "assignedTo", as: "assignedUser" });
Opportunity.belongsTo(User, { foreignKey: "userId", as: "creater" });
Opportunity.belongsTo(Contact, { foreignKey: "accountId", as: "account" });
Opportunity.belongsTo(Campaign, { foreignKey: "campaignId", as: "campaign" });
Opportunity.belongsTo(Vehicle, {
  foreignKey: "productId",
  as: "product",
});


Opportunity.belongsTo(FireRateCategory, {
  foreignKey: "fire_productId",
  as: "fire_product",
});

Opportunity.belongsToMany(User, {
  through: SharedOpporunity,
  foreignKey: "opportunityId",
  as: "shares",
});
User.belongsToMany(Opportunity, {
  through: SharedOpporunity,
  foreignKey: "userId",
  as: "sharedopportunitys",
});
module.exports = Opportunity;
