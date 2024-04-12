
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const BranchPhones = sequelize.define("branch_phones", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    branchId: {
         type: INTEGER,
        allowNull: false,
    },
    phoneNoId: {
          type: INTEGER,
        allowNull: false,
    }
})
module.exports = BranchPhones

