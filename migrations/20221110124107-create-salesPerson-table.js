"use strict";

const { INTEGER, STRING, DATE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("sales_persons", {
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
        allowNull: false
    },
    grandfather_name: {
        type: STRING,
        allowNull: true,
      },
       gender: {
     type: STRING,
    allowNull: false,
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
        allowNullL: false,
      },
      license_no: {
        type: STRING,
        allowNull: false,
      },
      license_expiration_date: {
        type: STRING,
        allowNull: false,
      },
      type: {
        type: STRING,
        allowNull: false,
      },
      userId: {
        type: INTEGER,
      },
      organization_name: {
        type: STRING,
      },
      createdAt: DATE,
      updatedAt: DATE,
    });
  },

  async down(queryInterface, Sequelize) {},
};
