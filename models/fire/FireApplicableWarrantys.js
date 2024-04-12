const { STRING, Sequelize } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const FireWarranty = require("./FireWarranty");
const FireWarrantyApplicableRelations = require("./FireWarrantyApplicableRelation");

const FireApplicableWarranty = sequelize.define("fire_applicable_warrantys", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    code: {
        type: STRING
    },
    description: {
        type: Sequelize.TEXT('long'),
    },
    nb: {
        type: STRING
    },
    userId: {
        type: INTEGER,
    },
    branchId: {
        type: INTEGER,
    }
});
// sequelize.sync({ alter: true });

FireWarranty.belongsToMany(FireApplicableWarranty, { through: FireWarrantyApplicableRelations });
FireApplicableWarranty.belongsToMany(FireWarranty, { through: FireWarrantyApplicableRelations });

module.exports = FireApplicableWarranty;