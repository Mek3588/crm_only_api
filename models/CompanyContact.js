const { STRING, UUID, UUIDV4, ARRAY, BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const SharedPeople = require("./SharedPeople");
const SMS = require("./SMS");
const CompanyContactsSms = require("./CompanyContactSMS");
const CompanyContactEmails = require("./CompanyContactEmail");
const EmailModel = require("./EmailModel");
const Employee = require("./Employee");
const Salutation = require("./Salutation");

const CompanyContact = sequelize.define("company_contacts", {
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
  grandFatherName: {
    type: STRING,
  },
  status: {
    type: STRING,
    allowNull: false,
  },
  leadSource: {
    type: INTEGER,
  },
  gender: {
    type: STRING,
    allowNull: false,
  },
  salutationId: {
    type: INTEGER,
  },
  memberType: {
    type: STRING,
  },
  memberOf: {
    type: INTEGER,
  },
  memberName: {
    type: STRING,
  },
  assignedTo: {
    type: INTEGER,
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
    type: STRING,
  },
  TOT: {
    type: STRING,
  },
  streetName: {
    type: STRING,
  },
  note: {
    type: STRING,
  },
  website: {
    type: STRING,
  },
  zipCode: {
    type: STRING,
  },
  TINNumber: {
    type: STRING,
  },
  socialSecurity: {
    type: STRING,
  },
  languageNotifications: {
    type: STRING,
  },
  decisionMaker: {
    type: BOOLEAN,
  },
});
CompanyContact.belongsTo(User, {
  foreignKey: "assignedTo",
  as: "assignedUser",
});
CompanyContact.belongsTo(Salutation, {
  foreignKey: "salutationId",
  as: "salutation",
});

CompanyContact.belongsToMany(SMS, { through: CompanyContactsSms });
SMS.belongsToMany(CompanyContact, { through: CompanyContactsSms });

EmailModel.belongsToMany(CompanyContact, { through: CompanyContactEmails });
CompanyContact.belongsToMany(EmailModel, { through: CompanyContactEmails });

CompanyContact.belongsToMany(User, {
  through: SharedPeople,
  foreignKey: "contactId",
  as: "shares",
});
User.belongsToMany(CompanyContact, {
  through: SharedPeople,
  foreignKey: "userId",
  as: "shareds",
});

module.exports = CompanyContact;
