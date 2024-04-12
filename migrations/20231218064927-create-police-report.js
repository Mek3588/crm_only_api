'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PoliceReports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id: {
        type: Sequelize.INTEGER
      },
      claimNumber: {
        type: Sequelize.STRING
      },
      plateNumber: {
        type: Sequelize.STRING
      },
      accidentDate: {
        type: Sequelize.DATE
      },
      accidentTime: {
        type: Sequelize.STRING
      },
      accidentRegion: {
        type: Sequelize.STRING
      },
      accidentCity: {
        type: Sequelize.STRING
      },
      accidentKebele: {
        type: Sequelize.STRING
      },
      accidentSpecificLocation: {
        type: Sequelize.STRING
      },
      accidentType: {
        type: Sequelize.STRING
      },
      accidentCause: {
        type: Sequelize.STRING
      },
      accidentDescription: {
        type: Sequelize.STRING
      },
      driverFirstName: {
        type: Sequelize.STRING
      },
      driverMiddleName: {
        type: Sequelize.STRING
      },
      driverLicenseNumber: {
        type: Sequelize.STRING
      },
      driverLicenseType: {
        type: Sequelize.STRING
      },
      isaccidentInvolveOtherVehicle: {
        type: Sequelize.STRING
      },
      plateNumberOfOtherVehicle: {
        type: Sequelize.STRING
      },
      driverFirstNameOfOtherVehicle: {
        type: Sequelize.STRING
      },
      driverMiddleNameOfOtherVehicle: {
        type: Sequelize.STRING
      },
      insuranceCompanyOfOtherVehicle: {
        type: Sequelize.STRING
      },
      branchNameOfInsuranceCompanyOfOtherVehicle: {
        type: Sequelize.STRING
      },
      driverOfOtherVehicleRegion: {
        type: Sequelize.STRING
      },
      driverOfOtherVehicleCity: {
        type: Sequelize.STRING
      },
      driverOfOtherVehicleKebele: {
        type: Sequelize.STRING
      },
      driverOfOtherVehicleHouseNumber: {
        type: Sequelize.STRING
      },
      driverOfOtherVehiclePhoneNumber: {
        type: Sequelize.STRING
      },
      driverOfOtherVehicleLicenseNumber: {
        type: Sequelize.STRING
      },
      driverOfOtherVehicleLicenseType: {
        type: Sequelize.STRING
      },
      driverOfOtherVehicleLicenseRenewalDate: {
        type: Sequelize.DATE
      },
      driverOfOtherVehicleLicenseIssueDate: {
        type: Sequelize.DATE
      },
      ownerFirstNameOfOtherVehicle: {
        type: Sequelize.STRING
      },
      ownerMiddleNameOfOtherVehicle: {
        type: Sequelize.STRING
      },
      wnerRegionOfOtherVehicle: {
        type: Sequelize.STRING
      },
      ownerOfOtherVehicleKebele: {
        type: Sequelize.STRING
      },
      ownerOfOtherVehicleHouseNumber: {
        type: Sequelize.STRING
      },
      ownerOfOtherVehiclePhoneNumber: {
        type: Sequelize.STRING
      },
      policeReportDocument: {
        type: Sequelize.STRING
      },
      injuredPersonFirstName: {
        type: Sequelize.STRING
      },
      injuredPersonMiddleName: {
        type: Sequelize.STRING
      },
      injuredPersonIdentity: {
        type: Sequelize.STRING
      },
      injuredPersonAddress: {
        type: Sequelize.STRING
      },
      injuredPersonInjuryType: {
        type: Sequelize.STRING
      },
      isInjuredAnimal: {
        type: Sequelize.STRING
      },
      injuredAnimalOwnerFirstName: {
        type: Sequelize.STRING
      },
      injuredAnimalOwnerMiddleName: {
        type: Sequelize.STRING
      },
      injuredAnimalType: {
        type: Sequelize.STRING
      },
      injuredAnimalOwnerAddress: {
        type: Sequelize.STRING
      },
      injuredAnimalAmount: {
        type: Sequelize.INTEGER
      },
      injuredAnimalEstimatedValue: {
        type: Sequelize.DOUBLE
      },
      vehicleDamageDescription: {
        type: Sequelize.STRING
      },
      numberOfPeopleDuringAccident: {
        type: Sequelize.INTEGER
      },
      vehicleCargoAmountDuringAccident: {
        type: Sequelize.DOUBLE
      },
      damageDescription: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PoliceReports');
  }
};