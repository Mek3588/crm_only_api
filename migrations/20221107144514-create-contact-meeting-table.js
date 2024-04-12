"use strict";

const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("contact_meetings", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      subject: {
        type: STRING,
        allowNull: false,
      },
      startDate: {
        type: DATE,
        allowNull: false,
      },
      startTime: {
        type: DATE,
        allowNull: false,
      },
      dueDate: {
        type: DATE,
        allowNull: false,
      },
      dueTime: {
        type: DATE,
        allowNull: false,
      },
      assignedTo: {
        type: INTEGER,
      },
      meetingUrl: {
        type: STRING,
      },
      status: {
        type: STRING,
      },
      userId: {
        type: INTEGER,
      },

      targetId: {
        type: INTEGER,
      },
      target: {
        type: STRING,
      },
      description: {
        type: STRING,
      },
      type: {
        notNull: false,
        type: STRING,
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
