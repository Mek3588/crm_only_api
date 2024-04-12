const { STRING, Sequelize } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const VehicleCategory = require("./VehicleCategory");
const CoverRate = require("./../CoverRate");
const AgeLoad = require("../AgeLoad");

const Branch = require("../Branch");
const PeriodRate = require("../PeriodRate");


const CustomerInputMotor = sequelize.define("customer_input_motors", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    owner_first_name: {
        type: STRING
    },
    owner_middle_name: {
        type: STRING
    },
    owner_last_name: {
        type: STRING
    },
    owner_phoneNo: {
        type: STRING
    },
    business_source: {
        type: STRING
    },
    insurance_type: {
        type: INTEGER,
    },
    vehicle_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    vehicle_type: {
        type: STRING,
        allowNull: false
    },
    cc: {
        type: STRING
    },
    manufactured_date: {
        type: STRING,
        allowNull: false,
    },
    made_of: {
        type: INTEGER,
        allowNull: false
    },
    duration: {
        type: STRING,
        allowNull: false,
    },
    coverType: {
        type: INTEGER,
        allowNull: false
    },
    sumInsured: {
        type: INTEGER,
        allowNull: false,
    },
    branchId: {
        type: INTEGER
    },
});

CustomerInputMotor.belongsTo(VehicleCategory, { foreignKey: "vehicle_type" })
CustomerInputMotor.belongsTo(CoverRate, { foreignKey: "coverType" })
CustomerInputMotor.belongsTo(PeriodRate, { foreignKey: "duration" })
CustomerInputMotor.belongsTo(Branch, { foreignKey: "branchId" })
CustomerInputMotor.belongsTo(AgeLoad, { foreignKey: "made_of" })


module.exports = CustomerInputMotor;