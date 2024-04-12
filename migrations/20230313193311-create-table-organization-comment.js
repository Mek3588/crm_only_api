'use strict';

const { INTEGER, STRING, DATE } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("organization_comments", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
      },
      Comment: {
        type: STRING,
        allowNull: false,
    },
   organizationId: {
        type: INTEGER,
        allowNull: false,
    },
    userId: {
        type: INTEGER,
        allowNull: false,
    },
      createdAt: DATE,
      updatedAt: DATE
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
