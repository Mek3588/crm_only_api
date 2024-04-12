'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PoliceReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PoliceReport.init({
    id: DataTypes.INTEGER,
    claimNumber: DataTypes.STRING,
    plateNumber: DataTypes.STRING,
    accidentDate: DataTypes.DATE,
    accidentTime: DataTypes.STRING,
    accidentRegion: DataTypes.STRING,
    accidentCity: DataTypes.STRING,
    accidentKebele: DataTypes.STRING,
    accidentSpecificLocation: DataTypes.STRING,
    accidentType: DataTypes.STRING,
    accidentCause: DataTypes.STRING,
    accidentDescription: DataTypes.STRING,
    driverFirstName: DataTypes.STRING,
    driverMiddleName: DataTypes.STRING,
    driverLicenseNumber: DataTypes.STRING,
    driverLicenseType: DataTypes.STRING,
    isaccidentInvolveOtherVehicle: DataTypes.STRING,
    plateNumberOfOtherVehicle: DataTypes.STRING,
    driverFirstNameOfOtherVehicle: DataTypes.STRING,
    driverMiddleNameOfOtherVehicle: DataTypes.STRING,
    insuranceCompanyOfOtherVehicle: DataTypes.STRING,
    branchNameOfInsuranceCompanyOfOtherVehicle: DataTypes.STRING,
    driverOfOtherVehicleRegion: DataTypes.STRING,
    driverOfOtherVehicleCity: DataTypes.STRING,
    driverOfOtherVehicleKebele: DataTypes.STRING,
    driverOfOtherVehicleHouseNumber: DataTypes.STRING,
    driverOfOtherVehiclePhoneNumber: DataTypes.STRING,
    driverOfOtherVehicleLicenseNumber: DataTypes.STRING,
    driverOfOtherVehicleLicenseType: DataTypes.STRING,
    driverOfOtherVehicleLicenseRenewalDate: DataTypes.DATE,
    driverOfOtherVehicleLicenseIssueDate: DataTypes.DATE,
    ownerFirstNameOfOtherVehicle: DataTypes.STRING,
    ownerMiddleNameOfOtherVehicle: DataTypes.STRING,
    wnerRegionOfOtherVehicle: DataTypes.STRING,
    ownerOfOtherVehicleKebele: DataTypes.STRING,
    ownerOfOtherVehicleHouseNumber: DataTypes.STRING,
    ownerOfOtherVehiclePhoneNumber: DataTypes.STRING,
    policeReportDocument: DataTypes.STRING,
    injuredPersonFirstName: DataTypes.STRING,
    injuredPersonMiddleName: DataTypes.STRING,
    injuredPersonIdentity: DataTypes.STRING,
    injuredPersonAddress: DataTypes.STRING,
    injuredPersonInjuryType: DataTypes.STRING,
    isInjuredAnimal: DataTypes.STRING,
    injuredAnimalOwnerFirstName: DataTypes.STRING,
    injuredAnimalOwnerMiddleName: DataTypes.STRING,
    injuredAnimalType: DataTypes.STRING,
    injuredAnimalOwnerAddress: DataTypes.STRING,
    injuredAnimalAmount: DataTypes.INTEGER,
    injuredAnimalEstimatedValue: DataTypes.DOUBLE,
    vehicleDamageDescription: DataTypes.STRING,
    numberOfPeopleDuringAccident: DataTypes.INTEGER,
    vehicleCargoAmountDuringAccident: DataTypes.DOUBLE,
    damageDescription: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PoliceReport',
  });
  return PoliceReport;
};