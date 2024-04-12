const { STRING, DOUBLE, INTEGER, BOOLEAN, ENUM } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");
const ShareHolderPhone = require("../ShareHolderPhone");
const PhoneNo = require("../PhoneNo");
const Address = require("../Address");
const ShareholderDepartment = require("./ShareholderDepartment");
const ShareholderContact = require("./ShareholderContact");
const ShareholderDocuments = require("./ShareholderDocument");
const ShareHolderSms = require("./ShareholderSMS");
const ShareHolderEmail = require("./ShareholderEmail");
const Employee = require("../Employee");
const CompanyContact = require("../CompanyContact");
const Department = require("../Department");
const Document = require("../Document");
const Email = require("../EmailModel");
const SMS = require("../SMS");
const Shareholder = sequelize.define("shareholders", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: STRING,
    allowNull: false,
  },
  shareHolderId: {
    type: STRING,
    allowNull: false,
    unique: true,
  },
  name: {
    type: STRING,
    allowNull: false,
  },

  gender: {
    type: STRING,
  },
  // legalEntity: {
  //      type: STRING,

  // },
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
  numberOfShare: {
    type: INTEGER,
  },
  userId: {
    type: INTEGER,
  },
  active: {
    type: BOOLEAN,
    allowNull: false,
  },
  stateOfInfluence: {
    type: ENUM("Major", "Influential", "Non-Influential"),
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
  zipCode: {
    type: STRING,
  },
  socialSecurity: {
    type: STRING,
  },
  profilePicture: {
    type: STRING,
  },
  note: {
    type: STRING,
  },
  employeeId: {
    type: INTEGER,
  },
});

Shareholder.belongsTo(User);

//assigne to
Shareholder.belongsTo(Employee);

// ContactDocuments
Shareholder.belongsToMany(SMS, { through: ShareHolderSms });
SMS.belongsToMany(Shareholder, { through: ShareHolderSms });

Email.belongsToMany(Shareholder, { through: ShareHolderEmail });
Shareholder.belongsToMany(Email, { through: ShareHolderEmail });

Shareholder.belongsToMany(Document, { through: ShareholderDocuments });
Document.belongsToMany(Shareholder, { through: ShareholderDocuments });

Shareholder.belongsToMany(CompanyContact, { through: ShareholderContact });
CompanyContact.belongsToMany(Shareholder, { through: ShareholderContact });

//
//share with
Shareholder.belongsToMany(Department, { through: ShareholderDepartment });
Department.belongsToMany(Shareholder, { through: ShareholderDepartment });
// ShareHolders.belongsToMany(PhoneNo,{ through: ShareHolderPhone })
// PhoneNo.belongsToMany(ShareHolders, { through: ShareHolderPhone });
// // ShareHolders.belongsTo(Address)
module.exports = Shareholder;
