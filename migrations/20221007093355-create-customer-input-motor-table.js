'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("customer_input_motors", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      owner_name: {
        type: Sequelize.STRING
      },
      owner_phoneNo: {
        type: Sequelize.STRING
      },
      business_source: {
        type: Sequelize.STRING
      },
      insurance_type: {
        type: Sequelize.INTEGER,
      },
      vehicle_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      vehicle_type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cc: {
        type: Sequelize.STRING
      },
      manufactured_date: {
        type: Sequelize.STRING,
        allowNull: false
      },
      made_of: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coverType: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sumInsured: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      branchId: {
        type: Sequelize.INTEGER
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
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
