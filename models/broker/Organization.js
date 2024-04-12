const { INTEGER, STRING, BOOLEAN } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");
const CompanyContact = require("../CompanyContact");
const Department = require("../Department");
const Document = require("../Document");
const Email = require("../Email");
const Employee = require("../Employee");
const SMS = require("../SMS");
const OrganizationContact = require("./OrganizationContact");
const OrganizationDocuments = require("./OrganizationDocument");
const OrganizationEmails = require("./OrganizationEmail");
const OrganizationSms = require("./OrganizationSMS");
const OrganizationDepartment = require('./OrganizationDepartment');
const EmailModel = require("../EmailModel");
const Organization = sequelize.define("organizations", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
    name: {
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
     type: STRING
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
    licenseNumber: {
        type: STRING,
        allowNull:false
    },
    licenseIssuedDate: {
       type: STRING,
        allowNull:false
    },
     licenseExpirationDate: {
       type: STRING,
        allowNull:false
    },
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
     type:STRING
  },
  userId: {
    type:INTEGER
  },
  description: {
     type:STRING
  },
  
});
  Organization.belongsTo(User)


Organization.belongsToMany(SMS, { through: OrganizationSms })
SMS.belongsToMany(Organization, { through: OrganizationSms})

EmailModel.belongsToMany(Organization, { through: OrganizationEmails })
Organization.belongsToMany(EmailModel, { through: OrganizationEmails })

Organization.belongsToMany(Document, { through: OrganizationDocuments })
Document.belongsToMany(Organization, { through: OrganizationDocuments })

Organization.belongsToMany(CompanyContact, { through: OrganizationContact })
CompanyContact.belongsToMany(Organization, { through: OrganizationContact})

//share with
Organization.belongsToMany(Department, { through: OrganizationDepartment })
Department.belongsToMany(Organization, { through: OrganizationDepartment })
module.exports = Organization;
