'use strict';

const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, DOUBLE, BOOLEAN } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("endorsement_files_paths", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      endorsementNo: {
        type: STRING
      },
      filePath: {
        type: STRING
      },
      fileName: {
        type: STRING,
        allowNull: false,
      },
      policyId: {
        type: INTEGER
      },
      isWarranty: {
        type: BOOLEAN,
        default: false
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
  }
};
