'use strict';

const { DOUBLE } = require("sequelize");
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("products", {
        id: {
          type: INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        productName: {
          type: STRING,
          allowNull: false,
        },
        manufacturer: {
          type: STRING,
          allowNull: false,
        },
        productCategory: {
          type: STRING,
          allowNull: false,
        },
        vendorName: {
          type: STRING,
        },
        website: {
          type: STRING,
        },
        vendorBatchNo: {
          type: STRING,
          allowNull: false,
        },
        mfrBatchNo: {
          type: STRING,
          allowNull: false,
        },
        productSheet: {
          type: STRING,
          allowNull: false,
        },
        serialNo: {
          type: STRING,
        },
        glAccount: {
          type: STRING,
        },
      
        sharedWith: {
          type: STRING,
          allowNull: false,
        },
        renewable: {
          type: STRING,
          allowNull: false,
        },
        isProductActive: {
          type: STRING,
          allowNull: false,
        },
        description: {
          type: STRING,
        },
        unitPrice: {
          type: DOUBLE,
        },
      
        purchase: {
          type: STRING,
          allowNull: false,
        },
        taxes: {
          type: DOUBLE,
          allowNull: false,
        },
        usageUnit: {
          type: STRING,
        },
      
      
        salesStartDate: {
          type: DATE,
        },
      
        salesEndDate: {
          type: DATE,
        },
      
        supportStartDate: {
          type: DATE,
        },
      
        supportExpiryDate: {
          type: DATE,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
