'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.createTable("age_loads", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,

      },
      made_of: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      min_age: {
        type:Sequelize.INTEGER,
        allowNull: false
      },
      max_age: {
        type:Sequelize.INTEGER,
        allowNull: false
      },
      load_rate: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
