"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("contact_tasks", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
    
      task:{
        type:STRING,
        allowNull: false
      },
    
      dueDate:{
        type:STRING,
        allowNull: false
      },
      createdDate: {
        type: STRING,
        allowNull: false
      },
      note:{
        type: STRING,
        
      },
      userId:{
        type: INTEGER
      },
      assignedTo:{
        type: INTEGER
      },
      targetId: {
        type:INTEGER
      },
      target: {
        type: STRING
      },

      createdAt: DATE,
      updatedAt: DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
