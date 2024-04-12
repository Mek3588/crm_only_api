"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("fire_loading_rates", {
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
        type: STRING,
      },
      rate: {
        type: STRING,
      },
      isDiscount: {
        type: BOOLEAN,
      },
      description: {
        type: STRING,
      },
      createdAt: DATE,
      updatedAt: DATE,
    }).then((result) => {
      queryInterface.bulkInsert("fire_loading_rates",[
        {
          name: "Area Loading",
          rate: 10,
          isDiscount: false
        },
        {
          name: "Fire Prone Load",
          rate: 10,
          isDiscount: false
        },
        {
          name: "Poor House Keeping",
          rate: 15,
          isDiscount: false
        },
        {
          name: "Branch Discount",
          rate: 20,
          isDiscount: true
        },
        {
          name: "Partnership Discount",
          rate: 7.5,
          isDiscount: true
        },
        {
          name: "Security Appliance Discount",
          rate: 10,
          isDiscount: true
        },
        {
          name: "Area Discount",
          rate: 7.5,
          isDiscount: true
        },
        {
          name: "Loss Ratio Discount",
          rate: 10,
          isDiscount: true
        },
        {
          name: "Voluntary Excess Discount",
          rate: 10,
          isDiscount: true
        },
        {
          name: "In Addis Ababa and perfectly accessible and near for fire birgades",
          rate: 10,
          isDiscount: false
        },
        {
          name: "In Addis Ababa and accessible but not near fire birgades",
          rate: 7.5,
          isDiscount: false
        },
        {
          name: "In Big Towns and accessible and near for fire birgades in  Town",
          rate: 7.5,
          isDiscount: false
        },
        {
          name: "In Big Towns and accessible but not near for fire birgades in  Town",
          rate: 5,
          isDiscount: false
        },
      ])
    }).catch((err) => {
      
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
