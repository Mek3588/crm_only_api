const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const ServiceCategory = require("./ServiceCategory");
const Service = require("./Service");
const User = require("./acl/user");

const SoldService = sequelize.define("sold_services", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  productName: {
    type: STRING,
    allowNull: false,
  },
  status: {
    type: STRING,
    allowNull: false,
  },
  serviceId: {
    type: INTEGER,
    allowNull: false,
  },
  serviceCategoryId: {
    type: INTEGER,
    allowNull: false,
  },
  supportTerminationDate: {
    type: Date,
    allowNull: false,
  },
  private: {
    type: BOOLEAN,
  },
  whereBought: {
    type: STRING,
    allowNull: false,
  },
  relatedTo: {
    type: STRING,
    allowNull: false,
  },
  opportunity: {
    type: STRING,
    allowNull: false,
  },
  description: {
    type: STRING,
  },
});

SoldService.belongsTo(ServiceCategory); 
SoldService.belongsTo(Service); 
//OutSourcedService.belongsTo(User); 

module.exports = SoldService;
