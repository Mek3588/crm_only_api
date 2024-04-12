'use strict';
const { DATE, DOUBLE, INTEGER, STRING, BOOLEAN} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('todoLists', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
    taskName: {
        type: STRING,
    },
    taskDescription: {
        type: STRING,
    },
    taskDate: {
        type: STRING,
    },
    taskTime: {
        type: STRING,
    },
    taskStatus: {
        type: STRING,
    },
    taskPriority: {
        type: STRING,
    },
    taskCompleted: {
        type: BOOLEAN,
    },
    taskDeleted: {
        type: BOOLEAN,
    },
    customerId: {
        type: INTEGER,
    },
    userId: {
        type: INTEGER,
    },
    createdAt: {
        type: DATE,
    },
    updatedAt: {
        type: DATE,
    },
    
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('TodoLists');
  }
};
