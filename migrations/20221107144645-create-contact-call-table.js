const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("contact_calls", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      callType: {
        type: STRING,
        allowNull: false,
      },
      topic: {
        type: STRING,
        allowNull: false,
      },
      callDuration: {
        type: STRING,
      },
      userId: {
        type: INTEGER,
      },
      callHours: {
        type: STRING,
      },
      callMinutes: {
        type: STRING,
      },
      targetId: {
        type: INTEGER,
      },
      target: {
        type: STRING,
      },
      createdDate: {
        type: STRING,
        allowNull: false,
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
