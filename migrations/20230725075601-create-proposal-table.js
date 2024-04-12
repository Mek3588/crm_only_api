
"use strict";

const { INTEGER, BOOLEAN, STRING, DATE } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("proposals", {

      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      contactId: {
        type: INTEGER
      },
      proposalNo: {
        type: STRING
      },
      userId: {
        type: INTEGER
      },
      motorProposalId: {
        type: INTEGER
      },
      assignedTo: {
        type: INTEGER,
      },
      underwritingApproval: {
        type: STRING,
      },
      preApprovalCheck: {
        type: STRING,
      },
      specialApproval: {
        type: STRING,
      },
      branchManagerApproval: {
        type: STRING,
      },
      notificationNotSeen: {
        type: BOOLEAN
      },
      noClaim: {
        type: STRING
      },
      withholdingDocument: {
        type: STRING
      },
      tot: {
        type: STRING
      },
      effectiveFrom: {
        type: STRING
      },
      fireProposalId: {
        type: INTEGER
      },
      canNotEdit: {
        type: BOOLEAN
      },
      printPath: {
        type: STRING
      },
      multipleProposalId : {
        type : INTEGER
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