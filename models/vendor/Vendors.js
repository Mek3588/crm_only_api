const { STRING, BOOLEAN, INTEGER } = require("sequelize");

const sequelize = require("../../database/connections");
const User = require("../acl/user");
const CompanyContact = require("../CompanyContact");
const Department = require("../Department");
const Document = require("../Document");
const Email = require("../EmailModel");
const Employee = require("../Employee");
const SMS = require("../SMS");
const vendorDepartment = require("../vendor/VendorDepartment");
const VendorDocuments = require("../vendor/VendorDocument");
const VendorSms = require("../vendor/VendorSMS");
const VendorContact = require("./VendorContact");
const VendorEmails = require("./VendorEmail");

const Vendor = sequelize.define("vendors", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  vendorName: {
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
  category: {
    type: STRING,
    allowNull: false,
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

  glAccount: {
    type: STRING,
  },
  vat: {
    type: STRING,
  },
  annualPlan: {
    type: STRING,
  },
  tinNumber: {
    type: STRING,
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
    type: STRING,
  },
  active: {
    type: BOOLEAN,
    allowNull: false,
  },
  employeeId: {
    type: INTEGER,
  },
  userId: {
    type: INTEGER,
  },
});

Vendor.belongsTo(Employee)
Vendor.belongsTo(User)

// ContactDocuments

Vendor.belongsToMany(SMS, { through: VendorSms });
SMS.belongsToMany(Vendor, { through: VendorSms });

Email.belongsToMany(Vendor, { through: VendorEmails });
Vendor.belongsToMany(Email, { through: VendorEmails });

Vendor.belongsToMany(Document, { through: VendorDocuments })
Document.belongsToMany(Vendor, { through: VendorDocuments })

Vendor.belongsToMany(CompanyContact, { through: VendorContact })
CompanyContact.belongsToMany(Vendor, { through: VendorContact})

Vendor.belongsToMany(Department, { through: vendorDepartment })
Department.belongsToMany(Vendor, { through: vendorDepartment })

module.exports = Vendor;
