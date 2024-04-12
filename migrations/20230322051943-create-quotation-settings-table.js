'use strict';

const { INTEGER, STRING, DATE, BOOLEAN } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("quotation_settings", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      product: {
        type: STRING,
      },
      quotationCalculation: {
        type: STRING,
      },
      createdAt: DATE,
      updatedAt: DATE,
    }).then((result) => {
      queryInterface.bulkInsert("quotation_settings",[
        {
          product: "Fire",
          quotationCalculation: "Flat"
        },
        {
          product: "Motor",
          quotationCalculation: "Flat"
        },
        {
          product: "Marine",
          quotationCalculation: "Flat"
        },
        {
          product: "Money",
          quotationCalculation: "Flat"
        },

      ])
    }).catch((err) => {
      
    });
       
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
