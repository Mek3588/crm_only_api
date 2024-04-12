'use strict';

const { DATE,INTEGER } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
   return queryInterface.createTable("share_holder_phones", {
      id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,

     },
      shareHolderId: {
        type: INTEGER,
        allowNull: false
    },
    phoneNoId: {
        type: INTEGER,
        allowNull: false
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
