const { INTEGER, STRING, BOOLEAN } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");
const CompanyContact = require("../CompanyContact");
const Department = require("../Department");
const Document = require("../Document");
const Email = require("../EmailModel");
const Employee = require("../Employee");
const SMS = require("../SMS");
const CompetitorBudget = require("./CompetitorBudget");
const CompetitorEmails = require("./CompetitorEmail");
const CompetitorSms = require("./CompetitorSMS");
const CompetitorDocuments = require("./CompetitorDocument");
const CompetitorContact = require("./CompetitorContact");
const CompetitorDepartment = require("./CompetitorDepartment");
const EmailModelDocument = require("../EmailModelDocuments");
const Competitor = sequelize.define("competitors", {
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
    type: STRING,
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
    type: STRING,
  },
  streetName: {
    type: STRING,
  },

  //
  zipCode: {
    type: STRING,
  },
  tinNumber: {
    type: STRING,
  },
  active: {
    type: BOOLEAN,
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
  note: {
    type: STRING,
  },
  profilePicture: {
    type: STRING,
  },
  userId: {
    type: INTEGER,
  },
  employeeId: {
    type: INTEGER,
  },

  
});
  Competitor.belongsTo(User)

CompetitorBudget.belongsTo(Competitor)
Competitor.hasOne(CompetitorBudget)
//assigne to 
Competitor.belongsTo(Employee)

Competitor.belongsToMany(SMS, { through: CompetitorSms });
SMS.belongsToMany(Competitor, { through: CompetitorSms });

Email.belongsToMany(Competitor, { through: CompetitorEmails });
Competitor.belongsToMany(Email, { through: CompetitorEmails });

Competitor.belongsToMany(Document, { through: CompetitorDocuments });
Document.belongsToMany(Competitor, { through: CompetitorDocuments });

Competitor.belongsToMany(CompanyContact, { through: CompetitorContact });
CompanyContact.belongsToMany(Competitor, { through: CompetitorContact });

//share with
Competitor.belongsToMany(Department, { through: CompetitorDepartment });
Department.belongsToMany(Competitor, { through: CompetitorDepartment });

module.exports = Competitor;
