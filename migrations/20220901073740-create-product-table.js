"use strict";

const { NUMBER } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("products", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      productCategoryId: {
        type: INTEGER,
        allowNull: false,
      },
      classOfBusinesses: {
        type: STRING,
      },
      productType: {
        type: STRING,
        allowNull: false,
      },
      purpose: {
        type: STRING,
        allowNull: false,
      },
      productName: {
        type: STRING,
        allowNull: false,
      },
      rate: {
        type: INTEGER,
        allowNull: false,
      },
      description: {
        type: STRING,
        allowNull: false,
      },
      endorsment: {
        type: STRING,
      },
      clauses: {
        type: STRING,
      },
      warranty: {
        type: STRING,
      },
      certificate: {
        type: STRING,
      },
      declaration: {
        type: INTEGER,
      },
      agreements: {
        type: STRING,
      },
      coverNotes: {
        type: STRING
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
