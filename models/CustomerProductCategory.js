const { STRING, BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const Product = require("./Product");

const CustomerProductCategory = sequelize.define("customer_product_categorys", {
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
    description: {
        type: STRING,
    },
    isActive: {
        type: BOOLEAN
    },  
    });

    // CustomerProductCategory.hasMany(Product, {
    //     foreignKey: "productCategoryId"
    // });

module.exports = CustomerProductCategory;