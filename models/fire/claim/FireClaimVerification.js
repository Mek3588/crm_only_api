
const sequelize = require('../../../database/connections')
const { INTEGER, STRING, DOUBLE, DATE } = require('sequelize')
const Customer = require('../../customer/Customer');
const User = require('../../acl/user');
const Document = require("../../Document");
const FireClaimNotification = require('./FireClaimNotification');

const FireClaimVerification = sequelize.define('fire_claim_verifications', {
     id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      claimNumber: {
        type: STRING,
        allowNull: false
      },
      customerId: {
        type: INTEGER
      },
      policyNumber: {
        type: STRING,
      },
      insured: {
        type: STRING,
      },
      lossNature: {
        type: STRING
      },
      AccidentDate: {
        allowNull: false,
        type: STRING
      },
      fireClaimNotificationId: {
        //allowNull: false,
        type: INTEGER
      },
      underwritingApproval: {
        type: STRING,
      },
    });
    //FireClaimVerification.sync({force: true})

    FireClaimVerification.belongsTo(FireClaimNotification, {foreignKey: "fireClaimNotificationId"})

    module.exports = FireClaimVerification


