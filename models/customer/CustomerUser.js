
const sequelize = require("../../database/connections");
const { INTEGER } = require("sequelize");
const CustomerUser = sequelize.define("customer_user", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    accountId: {
        type: INTEGER,
        allowNull: false,
    },
    customerId: {
        type: INTEGER,
        allowNull: false,
    }

});
// CustomerEmployee.sync({ alter:  true });
module.exports = CustomerUser
