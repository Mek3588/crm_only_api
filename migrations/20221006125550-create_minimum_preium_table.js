const { STRING } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { INTEGER } = require("sequelize");
const { DATE } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("minimum_premiums", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      amount: {
        type: DOUBLE,
        allowNull: false,
      },
      category: {
        type: STRING,
        allowNull: false,
      },
      userId: {
        type: INTEGER,
        allowNull: true
      },
      vehicleCategoryId: {
        type: INTEGER,
        allowNull: true
      },
      type: {
        type: String,
        allowNull: true,
    },
      createdAt: DATE,
      updatedAt: DATE,
    })
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
