'use strict';

const { DATE, BOOLEAN } = require("sequelize");
const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const { DOUBLE } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {

        return queryInterface.createTable("campaign_branches", {
            id: {
                type: INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            campaignId: {
                type: INTEGER
            },
            branchId: {
                type: STRING

            },

            actualCost: {
                type: DOUBLE,
            },
            actualSalesCount: {
                type: DOUBLE,
            },
            actualResponseCount: {
                type: DOUBLE,
            },
            actualROI: {
                type: DOUBLE,
            },
            actualRevenue: {
                type: DOUBLE,
            },

            isBranchReported: {
                type: BOOLEAN
            },

            isTeamTotalReported: {
                type: BOOLEAN
            },


            branchName: {
                type: STRING

            },

            expectedCost: {
                type: DOUBLE,
            },
            expectedSalesCount: {
                type: DOUBLE,
            },
            expectedResponseCount: {
                type: DOUBLE,
            },
            expectedROI: {
                type: DOUBLE,
            },

            expectedRevenue: {
                type: DOUBLE,
            },


            isExpectedSet: {
                type: BOOLEAN
            },

            isTeamExpectedSet: {
                type: BOOLEAN
            },

            createdAt: DATE,
            updatedAt: DATE,
        })
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
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
