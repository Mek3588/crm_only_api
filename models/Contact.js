const { STRING, BOOLEAN, DATE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const Branch = require("./Branch");
const User = require("./acl/user");
const ContactBranch = require("./ContactBranch");
const VehicleCategory = require("./motor/VehicleCategory");
const SharedAccounts = require("./SharedAccounts");
const Document = require("./Document");
const ContactDocuments = require("./ContactDocument");
const CompanyContact = require("./CompanyContact");
const ContactCompanyConatact = require("./ContactCompanyContact");
const ContactEmails = require("./ContactEmail");
const EmailModel = require("./EmailModel");
const SMS = require("./SMS");
const ContactSms = require("./ContactSMS");
const PhoneNo = require("./PhoneNo");
const Employee = require("./Employee");
const SeenLead = require("./SeenLead");
const Vehicle = require("./motor/Vehicle");
const FireRateCategory = require("./fire/FireRateCategory");

const Contact = sequelize.define("contacts", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: STRING,
  },
  firstName: {
    type: STRING,
  },
  middleName: {
    type: STRING,
  },
  lastName: {
    type: STRING,
  },
  joinIndividualName: {
    type: STRING,
  },
  companyName: {
    type: STRING,
  },
  stage: {
    type: STRING,
    allowNull:true
  },
  accountStage: {
    type: STRING,
    allowNull:true
  },
  numberOfEmployees: {
    type: STRING,
  },
  memberOf: {
    type: INTEGER,
  },
  industry: {
    type: STRING,
  },
  status: {
    type: STRING,
  },
  assignedTo: {
    type: INTEGER,
    allowNull:true
  },
  branchId: {
    type: INTEGER,
    allowNull:true
  },
  parentLeadId: {
    type: INTEGER,
  },
  productId: {
    type: INTEGER,
  },
  primaryEmail: {
    type: STRING,
  },
  secondaryEmail: {
    type: STRING,
    allowNull:true
  },
  primaryPhone: {
    type: STRING,
    
  },
  secondaryPhone: {
    type: STRING,
    allowNull: true
  },
  website: {
    type: STRING,
  },
  fax: {
    type: STRING,
  },
  annualRevenue: {
    type: INTEGER,
  },
  country: {
    type: STRING,
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
  product_category:{
    type:STRING
  },
  tinNumber: {
    type: STRING,
  },
  vatRegistrationNumber: {
    type: STRING,
  },
  registrationDate: {
    type: STRING
  },
  socialSecurity: {
    type: STRING,
  },

  registeredForVat: {
    type: STRING,
  },
  description: {
    type: STRING,
  },
  userId: {
    type: INTEGER,
  },
  gender: {
    type: STRING,
  },
  deleted: {
    type: BOOLEAN,
    allowNull: false,
    default: false,
  },
  accountId: {
    type: INTEGER,
  },
  business_source_type: {
    type: STRING,
    // allowNull: false,
  },
  business_source: {
    type: STRING,
    // allowNull: false,
  },
  conversion_date: {
    type: DATE,
  },
  productIds: {
    type: STRING,
  },
  productNames: {
    type: STRING,
  },
  salutation: {
    type: STRING,
  },
  product_type: {
    type: STRING,
  },
  fire_productId: {
    type: INTEGER,
  },
  quotation_assigned_to: {
    type: STRING,
  },
  product_category: {
    type: STRING,
  },
});
Contact.belongsTo(User);
Contact.belongsTo(User, { foreignKey: "accountId", });
User.hasOne(Contact, { foreignKey: "accountId", });


Contact.belongsToMany(Document, { through: ContactDocuments });
Document.belongsToMany(Contact, { through: ContactDocuments });

Contact.belongsToMany(CompanyContact, { through: ContactCompanyConatact });
CompanyContact.belongsToMany(Contact, { through: ContactCompanyConatact });

Contact.belongsToMany(EmailModel, { through: ContactEmails });
EmailModel.belongsToMany(Contact, { through: ContactEmails });

Contact.belongsToMany(SMS, { through: ContactSms });
SMS.belongsToMany(Contact, { through: ContactSms });
Contact.belongsTo(Vehicle, {
  foreignKey: "productId",
  as: "product",
});

Contact.belongsTo(FireRateCategory, {
  foreignKey: "fire_productId",
  as: "fire_product",
});


Contact.belongsTo(Employee, { foreignKey: "quotation_assigned_to", as: "assignedemployee" });
Contact.belongsTo(User, { foreignKey: "assignedTo", as: "assignedUser" });
Contact.belongsTo(User, { foreignKey: "userId", as: "creater" });
Contact.belongsTo(Branch);
Contact.belongsTo(Contact, { foreignKey: "memberOf", as: "memberOfC" });

PhoneNo.belongsTo(Contact, { foreignKey: "ownerId", as: "phoneowner" });
Contact.hasOne(PhoneNo, { foreignKey: "ownerId", as: "phoneowner" });

Contact.belongsToMany(User, {
  through: SharedAccounts,
  foreignKey: "accountId",
  as: "shares",
});
Contact.belongsToMany(User, {
  through: SeenLead,
  foreignKey: "contactId",
  as: "seenUsers",
});
User.belongsToMany(Contact, {
  through: SeenLead,
  foreignKey: "userId",
  as: "seenContacts",
});
User.belongsToMany(Contact, {
  through: SharedAccounts,
  foreignKey: "userId",
  as: "sharedaccounts",
});
module.exports = Contact;
