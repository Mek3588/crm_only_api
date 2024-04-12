const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("account_notes", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    note:{
      type: STRING,
      allowNull:false
    },
    comment:{
      type:STRING,
      },
    createdDate: {
        type: STRING,
        allowNull: false
    },
    userId: {
        type:INTEGER
    },
    contactId: {
        type:INTEGER
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
