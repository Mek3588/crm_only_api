'use strict';

const { DATE,INTEGER,STRING } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("addresses", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,

      },
      country: {
        type: STRING,
        allowNull: false
    },
    city: {
        type: STRING,
        allowNull: false
    },
    subCity: {
        type: STRING,
        allowNull: false
    },
     woreda: {
        type: STRING,
        allowNull: false
    },
    houseNumber: {
        type: STRING,
        allowNull: false
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
