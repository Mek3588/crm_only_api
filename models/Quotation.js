const { STRING, BOOLEAN, DATE, DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");
const Employee = require("./Employee");
const Lead = require("./Lead");
const VehicleCategory = require("./motor/VehicleCategory");
const Opportunity = require("./Opportunity");
const CustomerInputMotor = require("./motor/CustomerInputMotor");
const Contact = require("./Contact");
const Product = require("./Product");
const Branch = require("./Branch");
const Vehicle = require("./motor/Vehicle");
const Addons = require("./motor/Addons");
const ComprehensiveTp = require("./ComprehnsicveTp")

const AgeLoad = require("./AgeLoad");
const LimitedCoverRate = require("./motor/LimitedCoverRate");
// const FinanceData = require("./FinanceData");

// const FinanceData = require("./FinanceData");

const Quotation = sequelize.define("quotations", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  requested_quotation_id: {
    type: INTEGER,
  },
  quotation_number: {
    type: STRING,
  },
  request_type: {
    type: STRING,
    allowNull: false,
  },
  coverType: {
    type: STRING,
    allowNull: false,
  },
  owner_first_name: {
    type: STRING,
    allowNull: false,
  },
  owner_middle_name: {
    type: STRING,
  },
  owner_last_name: {
    type: STRING,
  },
  company_name: {
    type: STRING,
    allowNull: false,
  },
  join_individual_name: {
    type: STRING,
    allowNull: false,
  },
  owner_phoneNo: {
    type: STRING,
    allowNull: false,
  },
  branchId: {
    type: INTEGER,
    allowNull: false,
  },
  vehicle_type: {
    type: STRING,
    // allowNull: false
  },

  purpose: {
    type: STRING,
  },
  ///////////////////////// from tp
  carrying_capacity: {
    type: INTEGER,
    // allowNull: false
  },
  cc: {
    type: INTEGER,
  },
  has_trailer: {
    type: BOOLEAN,
    // allowNull: false
  },
  special_truck: {
    type: BOOLEAN,
    // allowNull: false
  },
  main_driver: {
    type: INTEGER,
    default: 1,
  },
  additional_driver: {
    type: INTEGER,
  },
  driver_type: {
    type: STRING,
  },
  /////////////////////////////////////  from od

  is_named_driver: {
    type: BOOLEAN,
  },
  vehicleId: {
    type: INTEGER,
    // default: 1
  },
  manufactured_date: {
    type: STRING,
  },
  made_in: {
    type: INTEGER,
  },
  insurance_period: {
    type: INTEGER,
  },

  is_locally_modified_body: {
    type: BOOLEAN,
  },
  risk_type: {
    type: STRING,
  },
  is_garage: {
    type: BOOLEAN,
  },
  min_cc: {
    type: INTEGER,
  },
  max_cc: {
    type: INTEGER,
  },
  // min_seat: {
  //   type: INTEGER,
  // },
  // max_seat: {
  //   type: INTEGER,
  // },
  minCapacity: {
    type: INTEGER,
  },
  maxCapacity: {
    type: INTEGER,
  },
  /////////////////////

  sumInsured: {
    type: STRING,
  },

  premium: {
    type: STRING,
    // allowNull: false,
  },
  rate: {
    type: INTEGER,
  },
  calculation_sheet_path: {
    type: STRING,
  },
  comment: {
    type: STRING,
  },
  expirationDate: {
    type: STRING,
  },
  opportunityId: {
    type: INTEGER,
  },
  userId: {
    type: INTEGER,
  },
  document: {
    type: STRING,
  },
  contactId: {
    type: INTEGER,
  },
  status: {
    type: STRING,
    defaultValue: "Submitted",
  },
  assignedTo: {
    type: INTEGER,
  },
  duration: {
    type: STRING,
  },
  person_carrying_capacity: {
    type: INTEGER,
  },
  older: {
    type: BOOLEAN
  },
  comprehensive_cover_type_vehicle: {
    type: STRING
  },
  comprehensive_cover_type_id: {
    type: INTEGER
  },
  other_daily_cash: {
    type: INTEGER
  },
  limitted_cover_type : {
    type: STRING
  }
});

Quotation.belongsTo(User, { foreignKey: "userId", as: "user" });
Quotation.belongsTo(Branch, { foreignKey: "branchId" });
Quotation.belongsTo(Vehicle, { foreignKey: "vehicleId" });
Quotation.belongsTo(ComprehensiveTp, { foreignKey: "comprehensive_cover_type_id" });
Vehicle.hasMany(Quotation);
// Quotation.belongsTo(Lead, { foreignKey: "leadId" });
// Quotation.belongsTo(Employee, { foreignKey: "reportTo" });
// Quotation.belongsTo(Product);
// Quotation.belongsTo(CustomerInputMotor);

Quotation.belongsTo(Employee, {
  foreignKey: "assignedTo",
  as: "assignedEmployee",
});
Quotation.belongsTo(Contact, { foreignKey: "contactId", as: "lead" });

// Quotation.belongsTo(VehicleCategory, { foreignKey: "productId" });
// Quotation.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' })
Quotation.belongsTo(Opportunity, { foreignKey: "opportunityId" });
//Quotation.belongsTo(CustomerInputMotor, {foreignKey: "customerInputMotorId"})
//Quotation.belongsTo(AgeLoad, { foreignKey: "made_of" })
Quotation.hasMany(Addons)



module.exports = Quotation;
