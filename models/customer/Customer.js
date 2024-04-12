const { INTEGER, STRING, BOOLEAN } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");
const CompanyContact = require("../CompanyContact");
const Employee = require("../Employee");
const Document = require("../Document");
const Email = require("../EmailModel");
const SMS = require("../SMS");
const CustomerDocuments = require("./CustomerDocument");
const CustomerEmails = require("./CustomerEmail");
const CustomerSms = require("./CustomerSMS");
const Contact = require("../Contact");
const CustomerContact = require("./CustomerContact");
const CustomerProposal = require("./CustomerProposal");
const MotorProposal = require("../proposals/MotorProposal");
const CustomerUser = require("./CustomerUser");

const Customer = sequelize.define("customers", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  active: {
    type: BOOLEAN,
    default:true
  },
  registrationDate: {
    type: STRING,
  },
  expirationDate: {
    type: STRING,
  },
  userId: {
    type: INTEGER,
  },
  // employeeId:{
  //   type:INTEGER

  // },
  // status:{
  //   type:STRING

  // },
  // assignedTo: {
  //   type: INTEGER,
  // },
  contactId: {
    type: INTEGER,

  },
});



Customer.belongsTo(Employee)
Customer.belongsTo(User)

Customer.belongsTo(Contact, { foreignKey: 'contactId' });
Contact.hasOne(Customer);

Customer.belongsToMany(SMS, { through: CustomerSms })
SMS.belongsToMany(Customer, { through: CustomerSms })

// Customer.belongsToMany(User, {
//   through: CustomerUser,
//   foreignKey: "accountId",
//   as: "shares",
// });
// Customer.belongsTo(User, { foreignKey: "assignedTo", as: "assignedUser" });
// MoterProposal.belongsToMany(Customer, { through: CustomerProposal });
// Customer.belongsToMany(MoterProposal, { through: CustomerProposal });

Email.belongsToMany(Customer, { through: CustomerEmails })
Customer.belongsToMany(Email, { through: CustomerEmails })

// Customer.belongsToMany(Document, { through: CustomerDocuments })
// Document.belongsToMany(Customer, { through: CustomerDocuments })

Customer.belongsToMany(CompanyContact, { through: CustomerContact });
CompanyContact.belongsToMany(Customer, { through: CustomerContact });

// Customer.belongsToMany(Employee, { through: CustomerEmployee })
// Employee.belongsToMany(Customer, { through: CustomerEmployee })

module.exports = Customer;
