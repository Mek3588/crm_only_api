'use strict';

const { DOUBLE, STRING, NUMBER } = require("sequelize");
const { INTEGER } = require("sequelize");

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("phoneNos", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      ownerId: {
        type: INTEGER,
      },
      type: {
        type: STRING,
        allowNull: false,
      },
      phoneNo: {
        type: STRING,
        allowNull: false,
      },
      category: {
        type: STRING,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
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
