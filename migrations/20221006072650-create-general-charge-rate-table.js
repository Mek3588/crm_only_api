'use strict';
const { DATE } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("other_loading_and_discounts", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      chargeReson: {
        type: STRING,
        allowNull: false,

      },
      rate: {
        type: DOUBLE,
        allowNull: false
      },
      isLoading: {
        type: BOOLEAN,
        allowNull: false
      },
      visibleToCustomer: {
        type: BOOLEAN,
        // allowNull: false,
        defaultValue: true
      },
      // order_no: {
      //   type: INTEGER,
      //   allowNull: false
      // },
      createdAt: DATE,
      updatedAt: DATE,
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
