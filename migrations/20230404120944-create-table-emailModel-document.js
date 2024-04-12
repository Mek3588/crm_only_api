'use strict';

const { INTEGER, DATE, STRING } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("emailmodel_documents", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
  
    emailModelId: {
        type: INTEGER,
        allowNull: false
      },
      name: {
       type: STRING,
        allowNull: false
    },
    document: {
        type: STRING,
        allowNull: false
      },
 
          createdAt: DATE,
          updatedAt:DATE,
        })
        },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
