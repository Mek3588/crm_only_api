"use strict";

const { INTEGER, STRING, DATE } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("campaign_team", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      teamName: {
        type: STRING,
      },
      teamLeader: {
        type: STRING,
      },
      teamMembers: {
        type: STRING,
      },
      branchId: {
        type: STRING,
      },
      campaignId: {
        type: INTEGER,
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
