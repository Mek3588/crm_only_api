"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("employees", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      employeeId: {
        type: STRING,
        allowNull:false
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
      secondary_email: {
        type: STRING,
        isUnique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: STRING,
        allowNull: false,
      },
      secondary_phone: {
        type: STRING,
      },
      branchId: {
        type: INTEGER,
      },
      position: {
        type: STRING,
      },
      hiredDate: {
        type: Sequelize.DATE,
      },
      terminationDate: {
        type: Sequelize.DATE,
      },
      role: {
        type: STRING,
      },
      grade_level: {
        type: STRING,
      },
      isActive: {
        type: BOOLEAN,
      },
      isDepartmentManager: {
        type: BOOLEAN
      },
      tin_number: {
        type: STRING,
      },
      description_details: {
        type: STRING,
      },
      profile_picture: {
        type: STRING,
      },
      note: {
        type: STRING,
      },
      social_security_no: {
        type: STRING,
      },
      note: {
        type: STRING,
      },
      country: {
        type: STRING
      },
      region: {
        type: STRING,
      },
      city: {
          type: STRING,
      },
      sub_city: {
        type: STRING
      },
      wereda: {
          type: STRING,
      },
      kebele: {
          type: STRING,
      },
      house_no: {
        type: STRING,
      },
      po_box: {
        type: STRING,
      },
      departmentId: {
        type: INTEGER,
      },
      userId: {
        type: INTEGER,
      },
      salutation: {
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
