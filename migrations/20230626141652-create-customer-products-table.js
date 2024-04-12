"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, DOUBLE, BOOLEAN, TEXT } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("customer_products", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      customerProductCategoryId: {
        type: INTEGER,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      description: {
        type: TEXT('long'),
      },
      productImage: {
        type: STRING,
      },
      isActive: {
        type: BOOLEAN,
      },
      createdAt: DATE,
      updatedAt: DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
