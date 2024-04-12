"use strict";

const { DATE, STRING, INTEGER } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("drivers", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: STRING,
        allowNull: false,
      },
      father_name: {
        type: STRING,
        allowNull: false,
      },
      grandfather_name: {
        type: STRING,
        allowNull: false,
      },
      region: {
        type: STRING,
        allowNull: true,
      },
      sub_city: {
        type: STRING,
        allowNull: true,
      },
      wereda: {
        type: STRING,
        allowNull: true,
      },
      kebele: {
        type: STRING,
        allowNull: true,
      },
      house_no: {
        type: STRING,
        allowNull: true,
      },
      po_box: {
        type: STRING,
        allowNull: true,
      },
      occupation: {
        type: STRING,
        allowNull: true,
      },
      birth_date: {
        type: DATE,
        allowNull: true,
      },
      license_no: {
        type: INTEGER,
        allowNull: true,
      },
      grade: {
        type: STRING,
        allowNull: true,
      },
      expiration_date: {
        type: DATE,
        allowNull: true,
      },
      phone: {
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
