
const sequelize = require("../../database/connections");
const {  INTEGER,STRING } = require("sequelize");
const User = require("../acl/user");
const Vendor = require("./Vendors");
const VendorComment = sequelize.define("vendor_comments", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    Comment: {
        type: STRING,
        allowNull: false,
    },
    vendorId: {
        type: INTEGER,
        allowNull: false,
    },
    userId: {
        type: INTEGER,
        allowNull: false,
    }

});
Vendor.hasMany(VendorComment)
VendorComment.belongsTo(Vendor)


VendorComment.belongsTo(User)
module.exports = VendorComment

