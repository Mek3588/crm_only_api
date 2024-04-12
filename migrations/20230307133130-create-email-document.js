'use strict';

const { INTEGER, STRING, DATE } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("email_documents", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      emailModelId: {
        type: INTEGER,
        allowNull: false
      },
      documentId: {
        type: STRING,
        allowNull: false
      },
    createdAt: DATE,
    updatedAt: DATE,
    }
    )
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
