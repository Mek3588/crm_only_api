'use strict';
const { DATE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("risk_types", {
        id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      code: {
          type: INTEGER,
          allowNull: false,
      },
      type: {
          type: STRING,
          allowNull: false,
      },
      rate: {
          type: INTEGER,
          allowNull: false,
      },
      insuranceCategoryId: {
      type: INTEGER,
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
