"use strict";

const { INTEGER, STRING, BOOLEAN, DATE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("acls", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      groupId: {
        type: INTEGER,
        allowNull: false,
      },
      path: {
        type: STRING,
        allowNull: false,
      },
      canCreate: {
        type: BOOLEAN,
        allowNull: false,
      },
      canRead: {
        type: BOOLEAN,
        allowNull: false,
      },
      canEdit: {
        type: BOOLEAN,
        allowNull: false,
      },
      canDelete: {
        type: BOOLEAN,
        allowNull: false,
      },
      onlyMyBranch: {
        type: BOOLEAN,
        allowNull: false,
      },
      onlySelf: {
        type: BOOLEAN,
        allowNull: false,
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
  },
};
