'use strict';
const { DATE,INTEGER,STRING } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("campaign_socialmedias", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
       type: {
        type: STRING,
        allowNull:false
    },
    startingDate: {
        type: STRING,
        allowNull:false
    },
    endingDate: {
        type: STRING,
        allowNull:false
    },
    remark:{
        type: STRING
        
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
