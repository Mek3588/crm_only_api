const sequelize = require("../../database/connections");
const { STRING, INTEGER, DOUBLE, DATE } = require("sequelize");

const User = require("../acl/user");
const ReInsurance = sequelize.define("reInsurances", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    classOfBusiness: {
        type: STRING,
    },
    product: {
        type: STRING,
    },
    category: {
        type: STRING,
      },
    amount: {
        type: DOUBLE
    },
    activeFromDate: {
        type: DATE
    },
    activeUntilDate: {
        type: DATE
    },
    userId: {
        type: INTEGER
    }

    // withholdingDocument: {
    //     type: STRING
    // },

})
ReInsurance.belongsTo(User);
module.exports = ReInsurance;