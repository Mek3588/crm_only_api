const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("calls", {
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
      contactId: {
        type: INTEGER,
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
