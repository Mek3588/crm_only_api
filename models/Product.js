const { STRING, DOUBLE, DATE } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const Product = sequelize.define("products", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  productCategoryId: {
    type: INTEGER,
    allowNull: false,
  },
  classOfBusinesses: {
    type: STRING,
  },
  productType: {
    type: STRING,
    allowNull: false,
  },
  purpose: {
    type: STRING,
    allowNull: false,
  },
  productName: {
    type: STRING,
    allowNull: false,
  },
  rate: {
    type: INTEGER,
    allowNull: false,
  },
  description: {
    type: STRING,
    allowNull: false,
  },
  endorsment: {
    type: STRING,
  },
  clauses: {
    type: STRING,
  },
  warranty: {
    type: STRING,
  },
  certificate: {
    type: STRING,
  },
  declaration: {
    type: STRING,
  },
  agreements: {
    type: STRING,
  },
  coverNotes: {
    type: STRING
  }

});

module.exports = Product;
