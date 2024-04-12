"use strict";
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("quotations", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      requested_quotation_id: {
        type: INTEGER,
      },
      quotation_number: {
        type: INTEGER,
      },
      request_type: {
        type: STRING,
        allowNull: false,
      },
      coverType: {
        type: STRING,
        allowNull: false,
      },
      owner_name: {
        type: STRING,
        allowNull: false,
      },
      owner_phoneNo: {
        type: STRING,
        allowNull: false,
      },
      branchId: {
        type: INTEGER,
        allowNull: false,
      },
      vehicle_type: {
        type: STRING,
        // allowNull: false
      },

      purpose: {
        type: STRING,
      },
      ///////////////////////// from tp
      carrying_capacity: {
        type: INTEGER,
        // allowNull: false
      },
      cc: {
        type: INTEGER,
      },
      has_trailer: {
        type: BOOLEAN,
        // allowNull: false
      },
      main_driver: {
        type: INTEGER,
        default: 1,
      },
      additional_driver: {
        type: INTEGER,
      },
      driver_type: {
        type: STRING,
      },
      /////////////////////////////////////  from od

      is_named_driver: {
        type: BOOLEAN,
      },
      vehicleId: {
        type: INTEGER,
        // default: 1
      },
      manufactured_date: {
        type: STRING,
      },
      made_in: {
        type: INTEGER,
      },
      insurance_period: {
        type: INTEGER,
      },

      is_locally_modified_body: {
        type: BOOLEAN,
      },
      risk_type: {
        type: STRING,
      },
      is_garage: {
        type: BOOLEAN,
      },
      min_cc: {
        type: INTEGER,
      },
      max_cc: {
        type: INTEGER,
      },
      comprehensive_cover_type_vehicle: {
        type: STRING
      },
      // min_seat: {
      //   type: INTEGER,
      // },
      // max_seat: {
      //   type: INTEGER,
      // },
      minCapacity: {
        type: INTEGER,
      },
      maxCapacity: {
        type: INTEGER,
      },
      /////////////////////

      sumInsured: {
        type: STRING,
      },

      premium: {
        type: STRING,
        // allowNull: false,
      },
      calculation_sheet_path: {
        type: STRING,
      },
      rate: {
        type: INTEGER,
      },
      comment: {
        type: STRING,
      },
      expirationDate: {
        type: STRING,
      },
      opportunityId: {
        type: INTEGER,
      },
      userId: {
        type: INTEGER,
      },
      document: {
        type: STRING,
      },
      contactId: {
        type: INTEGER,
      },
      status: {
        type: STRING,
        defaultValue: "Submitted",
      },
      assignedTo: {
        type: INTEGER,
      },
      duration: {
        type: STRING,
      },
      person_carrying_capacity: {
        type: INTEGER,
      },
      older: {
        type: BOOLEAN
      },
      limitted_cover_type : {
        type: STRING
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
