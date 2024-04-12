'use strict';
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const { DOUBLE } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("campaign_sales", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      salesPersonId: {
        type: INTEGER,
        allowNull:false
      },
      campaignId: {
        type: INTEGER,
        allowNull: false
      },
       dateOfVisit: {
        type: STRING,
        allowNull: false
      },
      campany: {
          type: STRING
      },
      outcome: {
          type: STRING,
          allowNull: false
      },
        createdAt: DATE,
        updatedAt: DATE,
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
