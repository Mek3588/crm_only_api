"use strict";

const { INTEGER, STRING, DATE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("opportunitys", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      subject: {
        type: STRING,
        allowNull: false,
      },
      assignedTo: {
        type: INTEGER,
        allowNull: false,
      },
      userId: {
        type: INTEGER,
        allowNull: false,
      },
      probablity: {
        type: INTEGER,
        allowNull: false,
      },
      accountId: {
        type: INTEGER,
        allowNull: false,
      },
      productId: {
        type: INTEGER,
      },
      fire_productId: {
        type: INTEGER,
      },
      status: {
        type: STRING,
      },
      source: {
        type: STRING,
      },
      description: {
        type: STRING,
      },
      campaignId: {
        type: INTEGER,
      },
      createdAt: DATE,
      updatedAt: DATE,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
