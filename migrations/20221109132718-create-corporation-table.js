'use strict';

const { STRING } = require("sequelize");

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("corporations", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: { 
        type: Sequelize.STRING,
        allowNull: false,
    },
    industry: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        isUnique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
      phone: {
         type: Sequelize.STRING,
         isUnique: true,
        allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    branchId:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      address: {
        type: STRING,
        allowNull: false
    },
    business_source: {
        type: STRING,
        allowNull: false
    },
      stage: {
        type: Sequelize.STRING,
        allowNull: false
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
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
