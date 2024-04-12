'use strict';

/** @type {import('sequelize-cli').Migration} */
const { DATE, INTEGER,  } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('fire_rate_Warranty_associations', {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      fireRateId: {
        type: INTEGER,
        allowNull: false,
      },
      fireWarrantyId: {
        type: INTEGER,
        allowNull: false,
      },
      createdAt: DATE,
      updatedAt: DATE,
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
