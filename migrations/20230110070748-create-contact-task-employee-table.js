'use strict';

const { DATE,INTEGER, } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
        return queryInterface.createTable("contact_taskes_employees", {
    id: {
         type: INTEGER,
         allowNull: false,
         autoIncrement: true,
         primaryKey: true,
       },
        employeeId: {
         type: INTEGER,
        allowNull: false,
    },
    contactTaskId: {
          type: INTEGER,
        allowNull: false,
    },
    createdAt: DATE,
      updatedAt: DATE,
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
