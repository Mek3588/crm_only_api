"use strict";
const { STRING, BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("product_categories", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      categoryName: {
        type: STRING,
        allowNull: false,
      },
      classOfBusiness: {
          type: STRING,
          allowNull: false,
      },
      isActive: {
          type: BOOLEAN
      },
      userId: {
          type: INTEGER
      },

      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
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
