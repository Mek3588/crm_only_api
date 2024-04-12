"use strict";
const { DATE, DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("multiple_proposal_datas", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      quotationId: {
        type: INTEGER,
        allowNull: false,
      },
      multipe_riskId: {
        type: INTEGER
      },
      plate_no: {
        type: STRING
      },
      chasis_no: {
        type: STRING
      },
      engine_no: {
        type: STRING
      },
      librePath: {
        type: STRING
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
