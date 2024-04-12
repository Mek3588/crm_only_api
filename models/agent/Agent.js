const { INTEGER, STRING, BOOLEAN } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");
const CompanyContact = require("../CompanyContact");
const Department = require("../Department");
const Document = require("../Document");
const Email = require("../EmailModel");

const SMS = require("../SMS");
const AgentEmails = require("./AgentEmail");
const AgentSms = require("./AgentSMS");
const AgentDocuments = require("./AgentDocument")
const AgentContact = require('./AgentContact')
const AgentDepartment = require('./AgentDepartment')
const Agent = sequelize.define("agents", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
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
  website: {
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
    allowNull: false,
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


  building: {
    type: STRING
  },
  officeNumber: {
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
  tinNumber: {
    type: STRING
  },
  // active: {
  //   type:BOOLEAN
  // },
  registeredForVat: {
    type: STRING
  },
  vatRegistrationNumber: {
    type: STRING
  },
  tot: {
    type: STRING
  },
  note: {
    type: STRING
  },
  profilePicture: {
    type: STRING
  },
  userId: {
    type: INTEGER
  },
  licenseNumber: {
    type: STRING,
    allowNull: false
  },
  batch: {
    type: STRING,

  },
  licenseIssuedDate: {
    type: STRING,
    allowNull: false
  },
  licenseExpirationDate: {
    type: STRING,
    allowNull: false
  },
  licenseType: {
    type: STRING,
    allowNull: false
  },
  description: {
    type: STRING,

  },
  socialSecurity: {
    type: STRING,

  },
  accountId: {
    type: INTEGER
  }

});
Agent.belongsTo(User)
//assigne to 


Agent.belongsTo(User, {
  foreignKey: "accountId",
  as: "userAccount"
});
Agent.belongsToMany(SMS, { through: AgentSms })
SMS.belongsToMany(Agent, { through: AgentSms })

Email.belongsToMany(Agent, { through: AgentEmails })
Agent.belongsToMany(Email, { through: AgentEmails })

Agent.belongsToMany(Document, { through: AgentDocuments })
Document.belongsToMany(Agent, { through: AgentDocuments })

Agent.belongsToMany(CompanyContact, { through: AgentContact })
CompanyContact.belongsToMany(Agent, { through: AgentContact })

//share with
Agent.belongsToMany(Department, { through: AgentDepartment })
Department.belongsToMany(Agent, { through: AgentDepartment })

module.exports = Agent;
