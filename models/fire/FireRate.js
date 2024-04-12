const { INTEGER, STRING, DOUBLE, NUMBER } = require("sequelize");
const sequelize = require("../../database/connections");
const FireApplicableWarranty = require("./FireApplicableWarrantys");
const FireRateApplicableWarrantys = require("./FireRateApplicableWarrantys");
const FireRateCategory = require("./FireRateCategory");
const FireWarranty = require("./FireWarranty");
const FireRateWarrantyAssociation = require("./FireRateWarrantyAssociation");

const FireRate = sequelize.define("fire_rates", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  categoryId: {
    type: NUMBER,
    allowNull: false,
  },
  riskCode: {
    type: INTEGER,
    allowNull: false,
  },
  occupation: {
    type: STRING,
    allowNull: false,
  },
  rate: {
    type: DOUBLE,
    allowNull: false,
  },
  warranty: {
    type: INTEGER,
  },
});

FireRate.belongsTo(FireRateCategory, { foreignKey: "categoryId", as: "fire_rate_category" });

FireRate.belongsToMany(FireApplicableWarranty, {
  through: FireRateApplicableWarrantys,
});  
FireApplicableWarranty.belongsToMany(FireRate, {
    through: FireRateApplicableWarrantys,
});
FireRate.belongsToMany(FireWarranty, { through: FireRateWarrantyAssociation });
FireWarranty.belongsToMany(FireRate, {through: FireRateWarrantyAssociation  });

module.exports = FireRate;
