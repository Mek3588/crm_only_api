const { INTEGER, STRING, BOOLEAN } = require("sequelize");
const sequelize = require("../../database/connections");
const Employee = require("../Employee");
const User = require("../acl/user");
const CompanyContact = require("../CompanyContact");
const Department = require("../Department");
const Document = require("../Document");
const Email = require("../EmailModel");
const SMS = require("../SMS");
const PartnerDocuments = require("./PartnerDocument"); 
const PartnerEmails = require("./PartnerEmail");
const PartnerSms = require("./PartnerSMS");
const PartnerDepartment = require("./PartnerDepartment");
const PartnerContact = require("./PartnerContact");
const PartnerBudget = require("./PartnerBudget");

const Partner = sequelize.define("partners", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  partnerName: {
    type: STRING,
    allowNull: false,
  },
 
  primaryPhone: {
    type: STRING,
    allowNull: false,
  },
  secondaryPhone: {
    type: STRING,
    
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
    type: STRING,
  },
  kebele: {
    type: STRING,
  },
  building: {
    type: STRING,
  },
  officeNumber: {
    type: STRING,
  },
  poBox: {
    type: STRING
  },
  streetName: {
      type: STRING
  },
   zipCode: {
    type: STRING,
  },
  website: {
     type: STRING,
   },
     tinNumber: {
    type: STRING,
  },
  active: {
    type:BOOLEAN
  },
  licenseIssuedDate: {
    type: STRING,
     allowNull: false,
  },
   registeredForVat: {
    type: STRING,
  },
   vatRegistrationNumber: {
    type: STRING,
  },
   tot: {
    type: STRING,
  },
  profilePicture: {
     type:STRING
  },
  // companyProfile: {
  //   type:STRING
  // },
   note: {
    type: STRING,
  },
  userId: {
    type: INTEGER
  },
  employeeId: {
    type: INTEGER
  },
 
  });

PartnerBudget.belongsTo(Partner)
Partner.hasOne(PartnerBudget)

Partner.belongsTo(Employee)
Partner.belongsTo(User)
Partner.belongsToMany(SMS, { through: PartnerSms })
SMS.belongsToMany(Partner, { through: PartnerSms})


Email.belongsToMany(Partner, { through: PartnerEmails })
Partner.belongsToMany(Email, { through: PartnerEmails })

Partner.belongsToMany(Document, { through: PartnerDocuments })
Document.belongsToMany(Partner, { through: PartnerDocuments })

Partner.belongsToMany(CompanyContact, { through: PartnerContact })
CompanyContact.belongsToMany(Partner, { through: PartnerContact})

Partner.belongsToMany(Department, { through: PartnerDepartment})
Department.belongsToMany(Partner, { through: PartnerDepartment})

module.exports = Partner;
