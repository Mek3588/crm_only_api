'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'policereports',
      'driverLastName',
      {
        type: Sequelize.STRING
      }
    );
    await queryInterface.changeColumn(
      'policereports',
      'isAccidentInvolveOtherVehicle',
      {
        type: Sequelize.BOOLEAN
      }
    );
    

    await queryInterface.removeColumn('policereports', 'injuredPersonFirstName');
    await queryInterface.removeColumn('policereports', 'injuredPersonMiddleName');
    await queryInterface.removeColumn('policereports', 'injuredPersonIdentity');
    await queryInterface.removeColumn('policereports', 'injuredPersonAddress');
    await queryInterface.removeColumn('policereports', 'injuredPersonInjuryType');
    await queryInterface.removeColumn('policereports', 'injuredAnimalOwnerFirstName');
    await queryInterface.removeColumn('policereports', 'injuredAnimalOwnerMiddleName');
    await queryInterface.removeColumn('policereports', 'injuredAnimalType');
    await queryInterface.removeColumn('policereports', 'injuredAnimalOwnerAddress');
    await queryInterface.removeColumn('policereports', 'injuredAnimalAmount');
    await queryInterface.removeColumn('policereports', 'injuredAnimalEstimatedValue');
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
