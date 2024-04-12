const { STRING, BOOLEAN } = require("sequelize");
const { INTEGER, DATE } = require("sequelize");
const sequelize = require("../database/connections");
const Branch = require("./Branch");
const User = require("./acl/user");
const Department = require("./Department");
const EmployeeDocument = require('./EmployeeDocument');
const Document = require('./Document');
const SMS = require("./SMS");
const EmployeeSms = require("./EmployeeSMS");
const EmployeeEmails = require("./EmployeeEmail");
const EmailModel = require("./EmailModel");

const Employee = sequelize.define("employees", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  employeeId: {
    type: STRING,
    allowNull: false,
  },
  first_name: {
    type: STRING,
    allowNull: false,
  },
  father_name: {
    type: STRING,
    allowNull: false,
  },
  grandfather_name: {
    type: STRING,
    allowNull: false,
  },
  gender: {
    type: STRING,
    allowNull: false,
  },
  email: {
    type: STRING,
    isUnique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  secondary_email: {
    type: STRING,
  },
  phone: {
    type: STRING,
    allowNull: false,
  },
  secondary_phone: {
    type: STRING,
  },
  branchId: {
    type: INTEGER,
  },
  position: {
    type: STRING,
  },
  hiredDate: {
    type: DATE,
  },
  terminationDate: {
    type: DATE,
  },
  role: {
    type: STRING,
  },
  grade_level: {
    type: STRING,
  },
  salutation: {
    type: STRING,
  },
  isActive: {
    type: BOOLEAN,
  },
  isDepartmentManager: {
    type: BOOLEAN,
  },
  tin_number: {
    type: STRING,
  },
  description_details: {
    type: STRING,
  },
  profile_picture: {
    type: STRING,
  },
  note: {
    type: STRING,
  },
  social_security_no: {
    type: STRING,
  },
  note: {
    type: STRING,
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
  sub_city: {
    type: STRING,
  },
  wereda: {
    type: STRING,
  },
  kebele: {
    type: STRING,
  },
  house_no: {
    type: STRING,
  },
  po_box: {
    type: STRING,
  },
  departmentId: {
    type: INTEGER,
  },
  userId: {
    type: INTEGER,
  },
});

Employee.belongsTo(User);
User.hasOne(Employee);

Employee.belongsTo(Branch);
Department.hasMany(Employee);
Employee.belongsTo(Department);



Employee.belongsToMany(SMS, { through: EmployeeSms });
SMS.belongsToMany(Employee, { through: EmployeeSms });

EmailModel.belongsToMany(Employee, { through: EmployeeEmails });
Employee.belongsToMany(EmailModel, { through: EmployeeEmails });

Employee.belongsToMany(Document, { through: EmployeeDocument })
Document.belongsToMany(Employee, { through: EmployeeDocument })

module.exports = Employee;
