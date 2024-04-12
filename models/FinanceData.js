const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const Employee = require("./Employee");
const PhoneNo = require("./PhoneNo");
const Quotation = require("./Quotation");
// const Quotation = require("./Quotation");

const FinanceData = sequelize.define("financeDatas", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    // sum_insured: {
    //     type: DOUBLE,
    // },
    // premium: {
    //     type: DOUBLE,
    // },
    tp_fund_levy: {
        type: DOUBLE,
    },
    revenue_stamp: {
        type: DOUBLE,
    },
    excess_cont: {
        type: DOUBLE,
    },
    other: {
        type: DOUBLE,
    },
    sum: {
        type: DOUBLE,
    },
    userId: {
        type: INTEGER,
    },
    quotationId: {
        type: INTEGER,
    },
});
// FinanceData.belongsTo(Quotation, { foreignKey: "quotationId"});
FinanceData.belongsTo(Quotation);
Quotation.hasOne(FinanceData)
module.exports = FinanceData;