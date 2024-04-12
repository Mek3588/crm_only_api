'use strict';
const { STRING, INTEGER, DATE } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
     return queryInterface.createTable("vendor_comments", {
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
    vendorId: {
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
