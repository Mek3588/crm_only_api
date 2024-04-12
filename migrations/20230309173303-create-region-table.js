'use strict';
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("regions", {
        id: {
            type: INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        countryId: {
          type: INTEGER
        },
        name: {
            type: STRING,
            allowNull: false,
        },
        description: {
            type: STRING
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
