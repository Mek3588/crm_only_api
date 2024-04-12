'use strict';

const { DATE,INTEGER, } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.createTable("user_groups", {
    id: {
         type: INTEGER,
         allowNull: false,
         autoIncrement: true,
         primaryKey: true,
     },
    userId: {
        type: INTEGER,
        allowNull: false,
    },
    groupId: {
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
