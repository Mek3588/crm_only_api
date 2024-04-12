'use strict';
const { DATE,STRING,INTEGER } = require("sequelize");



module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("campaigns_tours", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      
     
      visitDate: {
        type: STRING,
        allowNull: false,
      },
      sector: {
        type: STRING,
        allowNull: false,
      },
      campaignId: {
        type: STRING
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
