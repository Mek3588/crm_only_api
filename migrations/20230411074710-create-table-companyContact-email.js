'use strict';

const { INTEGER, DATE } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("companyContact_emails", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    companyContactId: {
        type: INTEGER,
        allowNull: false
    },
    emailModelId: {
        type: INTEGER,
        allowNull: false
    },
      createdAt: DATE,
      updatedAt:DATE,
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
