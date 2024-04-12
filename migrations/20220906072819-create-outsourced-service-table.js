"use strict";
const { DATE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("outsourced_services", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      serviceName: {
        type: STRING,
        allowNull: false,
      },
      serviceCategoryId: {
        type: INTEGER,
        allowNull: false,
      },
      assignedTo: {
        type: INTEGER,
        allowNull: false,
      },
      sharedWith: {
        type: INTEGER,
        allowNull: false,
      },
      supportTerminationDate: {
        type: DATE,
        allowNull: false,
      },
      private: {
        type: BOOLEAN,
        allowNull: false,
      },
      whereBought: {
        type: STRING,
        allowNull: false,
      },
      relatedTo: {
        type: INTEGER,
        allowNull: true,
      },

      opportunity: {
        type: STRING,
        allowNull: false,
      },
      description: {
        type: STRING,
        allowNull: false,
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
