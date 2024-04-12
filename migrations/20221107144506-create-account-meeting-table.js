'use strict';


const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("account_meetings", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
       outCome: {
        type: STRING,
        allowNull: false,
    },
    date: {
        type: STRING,
        allowNull: false
    },
    time: {
        type: STRING,
        allowNull: false
    },
    duration: {
        type: STRING,
    },
    status: {
      type: STRING,
    },
    note: {
        type:STRING
      },
    createdDate: {
        type: STRING,
        allowNull: false
    },
    reportTo:{
      type:INTEGER
    },
    userId:{
        type:INTEGER
    },
    
    contactId: {
        type:INTEGER
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

 
