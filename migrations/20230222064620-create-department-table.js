'use strict';
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("departments", {
        id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        },
        name: {
            type: STRING,
            allowNull: false,
        },
        isActive:{
            type: BOOLEAN,
            allowNull: false,
        },
        description: {
            type: STRING
        },
        employeeId:{
            type: INTEGER,
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
