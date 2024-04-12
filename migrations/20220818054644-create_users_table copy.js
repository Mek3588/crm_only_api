"use strict";

const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const { BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("users", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      corporate_name: {
        type: STRING,
        allowNull: true,
      },
      first_name: {
        type: STRING,
        allowNull: false,
      },
      middle_name: {
        type: STRING,
        allowNull: false,
      },
      last_name: {
        type: STRING,
        allowNull: true,
      },
      email: {
        type: STRING,
        isUnique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: STRING,
        isUnique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      gender: {
        type: STRING,
        allowNull: false,
      },
      password: {
        type: STRING,
        allowNull: false,
      },

      role: {
        type: STRING,
        allowNull: false,
      },
      activated: {
        type: BOOLEAN,
        allowNull: false,
      },
      activation: {
        type: BOOLEAN,
        allowNull: false,
      },
      shortCode: {
        type: STRING,
      },
      shortCodeExpirationDate: {
        type: DATE,
      },
      profile_picture: {
        type: STRING,
      },
      userId: {
        type: INTEGER,
      },
      createdAt: DATE,
      updatedAt: DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable("users");
  },
};
