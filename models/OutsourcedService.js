const { STRING, DATE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const ServiceCategory = require("./ServiceCategory");
const User = require("./acl/user");

const OutsourcedService = sequelize.define("outsourced_services", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  serviceName: {
    type: STRING,
    allowNull: false,
  },
  serviceCategoryId: {
    type: INTEGER,
    allowNull: false,
  },
  assignedTo: {
    type: INTEGER,
    allowNull: false
  },
  sharedWith: {
    type: INTEGER,
    allowNull: false,
  },
  supportTerminationDate: {
    type: DATE,
    allowNull: false
  },
  private: {
    type: BOOLEAN,
  },
  whereBought: {
    type: STRING,
   allowNull: false
  },
  relatedTo: {
    type: STRING,
    allowNull: false,
  },
  opportunity: {
    type:STRING,
    allowNull:false
  },
  description: {
    type: STRING,
  },
});


OutsourcedService.belongsTo(ServiceCategory); 
//OutSourcedService.belongsTo(User); 

module.exports = OutsourcedService;
