'use strict';
const { DATE } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
      return queryInterface.createTable("fire_charge_rate", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    chargeReson: {
        type: STRING,
        allowNull: false,
        
    },
    rate:{
        type:DOUBLE,
        allowNull: false
    },
    isLoading:{
        type: BOOLEAN,
        allowNull:false
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
