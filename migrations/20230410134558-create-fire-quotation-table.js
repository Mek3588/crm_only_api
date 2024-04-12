"use strict";
const { DATE } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("fire_quotations", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      requested_quotation_id: {
        type: INTEGER,
      },
      request_type: {
        type: STRING,
        allowNull: false,
      },
      policy_No: {
        type: STRING,
      },
      quotation_no: {
        type: STRING,
      },
      owner_first_name: {
        type: STRING,
        allowNull: true,
      },
      owner_middle_name: {
        type: STRING,
        allowNull: true,
      },
      owner_last_name: {
        type: STRING,
        allowNull: true,
      },
      owner_phoneNo: {
        type: STRING,
        allowNull: false,
      },
      categoryId: {
        type: STRING,
        allowNull: false,
      },
      fireRateId: {
        type: STRING,
        allowNull: false,
      },
      class_of_house: {
        type: STRING,
      },
      wall_type: {
        type: STRING,
      },
      roof_type: {
        type: STRING,
      },
      floor_type: {
        type: STRING,
      },
      duration: {
        type: STRING,
      },
      sumInsured: {
        type: STRING,
        allowNull: false,
      },
      have_content_insurance: {
        type: BOOLEAN,
      },
      content_sum_insured: {
        type: STRING,
      },
      is_near_fire_birgade: {
        type: STRING,
      },
      have_security_appliances: {
        type: BOOLEAN,
      },
      have_branch_discount: {
        type: BOOLEAN,
      },
      have_partnership_discount: {
        type: BOOLEAN,
      },
      have_security_appliances: {
        type: BOOLEAN,
      },
      want_voluntary_excess_discount: {
        type: BOOLEAN,
      },
      have_loss_ration_discount: {
        type: BOOLEAN,
      },
      poor_house_keeping_load: {
        type: BOOLEAN,
      },
      fire_prone_load: {
        type: BOOLEAN,
      },
      premium: {
        type: DOUBLE,
      },
      expirationDate: {
        type: STRING,
      },
      calculation_sheet_path: {
        type: STRING,
      },
      want_negotiation: {
        type: BOOLEAN,
      },
      branchId: {
        type: INTEGER,
      },
      assignedTo: {
        type: INTEGER,
      },
      reportTo: {
        type: INTEGER,
      },
      userId: {
        type: INTEGER,
      },
      ownerId: {
        type: STRING,
      },
      partnerId: {
        type: INTEGER,
      },
      leadId: {
        type: INTEGER,
      },
      opportunityId: {
        type: INTEGER,
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
