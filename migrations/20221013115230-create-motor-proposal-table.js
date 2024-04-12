'use strict';
const { DATE } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER, BOOLEAN } = require("sequelize");

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable("motor_proposals", {
            id: {
                type: INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            chassisNo: {
                type: STRING
            },
            engineNo: {
                type: STRING
            },
            idImage: {
                type: STRING
            },
            termsAndConditions: {
                type: STRING
            },

            plateNumber: {
                type: STRING,
                allowNull: false
            },
            // horsePower: {
            //     type: DOUBLE,
            //     allowNull: false
            // },
            yearOfPurchased: {
                type: STRING
            },
            typeOfBody: {
                type: STRING
            },
            quotationId: {
                type: INTEGER
            },
            additionalCoverForInternalItems: {
                type: STRING
            },
            additionalCoverForInternalItemsMake: {
                type: STRING
            },
            additionalCoverForInternalItemsValue: {
                type: STRING
            },
            isItInAGoodState: {
                type: BOOLEAN
            },
            whereIsTheVehicleLeftOvernight: {
                type: STRING
            },
            otherOwnersName: {
                type: STRING
            },
            otherOwnersAddress: {
                type: STRING
            },
            financiallyIntrustedCompanyName: {
                type: STRING
            },
            financiallyIntrustedAddress: {
                type: STRING
            },
            drivingSince: {
                type: STRING
            },
            driverLicenseIssuedFrom: {
                type: STRING
            },
            physicalInfirmity: {
                type: STRING
            },
            OffenseInPastYear: {
                type: STRING
            },
            previousInsurance: {
                type: STRING
            },
            proposalHasBeenDeclinedBefore: {
                type: BOOLEAN
            },
            refusedToRenewPolicyByAnyInsurance: {
                type: BOOLEAN
            },
            insuranceCompanyHasCancelledYourPolicy: {
                type: BOOLEAN
            },
            insuranceCompanyHasIncreasedYourPremium: {
                type: BOOLEAN
            },
            requiredToCarryTheFirstPositionInALoss: {
                type: BOOLEAN
            },
            imposedSpecialCondition: {
                type: BOOLEAN
            },
            accidentOnTheVehicle: {
                type: STRING
            },
            personalInjury: {
                type: STRING
            },
            propertyDamage: {
                type: STRING
            },

            videoFootage: {
                type: STRING
            },
            document: {
                type: STRING
            },
            effectiveFrom: {
                type: STRING
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
