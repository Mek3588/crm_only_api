'use strict';
const { INTEGER, BOOLEAN, DATE, DOUBLE, STRING } = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("proposalComments", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      proposalId: {
        type: INTEGER
      },
      comment: {
        type: STRING
      },
      commentBy: {
        type: STRING
      },
      status: {
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
  }
};
