'use strict';
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const { DOUBLE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("email_services", {
      id: {
        type: INTEGER,
          allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      senderName: {
        type: INTEGER,
        
      },
      senderAddress: {
        type: STRING,
        
      },
      subject: {
        type: STRING,
        
      },
      message: {
        type: STRING,
        
      },
      misc: {
        type: STRING,
      
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
