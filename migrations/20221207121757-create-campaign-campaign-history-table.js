'use strict';
const { DATE,INTEGER,STRING } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
     return queryInterface.createTable("campaign_historys", {
       id: {
         type: INTEGER,
         allowNull: false,
         autoIncrement: true,
         primaryKey: true,
       },
        previousStartingDate: {
        type: STRING,
    },
    previousEndingDate: {
        type: STRING,
    },
    currentStartingDate: {
        type: STRING,
    },
    currentEndingDate: {
        type: STRING,
       },
       campaignId: {
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
