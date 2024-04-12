const { STRING, BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const Product = require("./Product");

const ProductCategory = sequelize.define("product_categories", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    categoryName: {
        type: STRING,
        allowNull: false,
    },
    classOfBusiness: {
        type: STRING,
        allowNull: false,
    },
    isActive: {
        type: BOOLEAN
    },
    userId: {
        type: INTEGER
    }
    
    });

    ProductCategory.hasMany(Product, {
        foreignKey: "productCategoryId"
    });

module.exports = ProductCategory;