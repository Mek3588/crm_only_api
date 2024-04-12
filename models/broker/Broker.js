const { INTEGER, STRING, BOOLEAN } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");
const CompanyContact = require("../CompanyContact");
const Department = require("../Department");
const Document = require("../Document");
const Email = require("../EmailModel");
const SMS = require("../SMS");
const BrokerEmails = require("./OrganizationEmail");
const BrokerSms = require("./OrganizationSMS");
const BrokerDocuments = require("./OrganizationDocument")
const BrokerContact = require('./BrokerContact')
const BrokerDepartment = require('./OrganizationDepartment');
const Organization = require("./Organization");

const Broker = sequelize.define("brokers", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  code: {
    type: STRING,
    // allowNull: false,
  },
  firstName: {
    type: STRING,
    allowNull: false,
  },
  fatherName: {
    type: STRING,
    allowNull: false,
  },
  grandfatherName: {
    type: STRING,
    allowNull: false,
  },
  gender: {
    type: STRING,
    allowNull: false,
  },

  primaryPhone: {
    type: STRING,
    allowNull: false,
  },
  secondaryPhone: {
    type: STRING
  },
  primaryEmail: {
    type: STRING,
    allowNull: false,
  },
  secondaryEmail: {
    type: STRING,
  },

  country: {
    type: STRING,
    allowNull: false,
  },
  region: {
    type: STRING,

  },
  city: {
    type: STRING,
  },
  subcity: {
    type: STRING,

  },
  woreda: {
    type: STRING
  },
  kebele: {
    type: STRING
  },
  poBox: {
    type: STRING
  },
  streetName: {
    type: STRING
  },

  //  
  zipCode: {
    type: STRING
  },

  // active: {
  //   type:BOOLEAN
  // },

  note: {
    type: STRING
  },
  profilePicture: {
    type: STRING
  },
  userId: {
    type: INTEGER
  },
  organizationId: {
    type: INTEGER
  },
  accountId: {
    type: INTEGER
  },
  isRepresentative: {
    type: BOOLEAN
  },
});
Broker.belongsTo(User)

//assigne to 

Broker.belongsTo(User, {
  foreignKey: "accountId",
  as: "userAccount"
});
Broker.belongsTo(Organization)
Organization.hasOne(Broker)



module.exports = Broker;
