'use strict';

const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, DOUBLE, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("endorsements", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      // coverRateId: {
      //   allowNull: false,
      //   type: INTEGER,
      // },
      filePath: {
        type: STRING,
        allowNull: false,
      },
      fileName: {
        type: STRING,
        allowNull: false,
      },
      userId: {
        type: INTEGER
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
  }
};
