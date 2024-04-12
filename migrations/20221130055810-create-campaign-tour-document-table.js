'use strict';

const { DATE,INTEGER } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
      return queryInterface.createTable("campaign_tour_documents", {
        id: {
          type: INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          },
        campaignsTourId: {
          type: INTEGER,
          },
        documentId: {
          type:INTEGER
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
