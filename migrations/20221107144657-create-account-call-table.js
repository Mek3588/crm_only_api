
const { DATE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("account_calls", {
      id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      callType: {
        type: STRING,
        allowNull:false
      },
      topic: {
          type: STRING,
          allowNull: false
      },
      callDuration: {
          type: STRING
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
