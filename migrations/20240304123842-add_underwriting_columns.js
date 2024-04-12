'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'underwritingclaimverifications',
      'accidentType',
      {
        type: Sequelize.STRING
      }
    );
    await queryInterface.addColumn(
      'underwritingclaimverifications',
      'accidentDate',
      {
        type: Sequelize.DATE
      }
    );
    await queryInterface.addColumn(
      'underwritingclaimverifications',
      'vehicleType',
      {
        type: Sequelize.STRING
      }
    );
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
