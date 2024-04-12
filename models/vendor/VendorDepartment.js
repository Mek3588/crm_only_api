
const sequelize = require("../../database/connections");
const {  INTEGER } = require("sequelize");
const VendorDepartment = sequelize.define("vendor_departments", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    departmentId: {
        type: INTEGER,
        allowNull: false,
    },
    vendorId: {
        type: INTEGER,
        allowNull: false,
    }

});
// VendorDepartment.sync({ alter:  true });
module.exports = VendorDepartment
