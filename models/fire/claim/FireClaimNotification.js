
const sequelize = require('../../../database/connections')
const { INTEGER, STRING, DOUBLE, DATE } = require('sequelize')
const Customer = require('../../customer/Customer');
const User = require('../../acl/user');
const Document = require("../../Document");
const Policy = require('../../Policy');

const FireClaimNotification = sequelize.define('fire_claim_notifications', {
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
      policyId: {
        type: INTEGER
      },
      policyNumber: {
        type: STRING,
      },
      fullName: {
        type: STRING,
      },
      phoneNumber: {
        type: STRING
      },
      huoseNumber: {
        allowNull: false,
        type: STRING
      },
      claimIssuedDate: {
        allowNull: false,
        type: DATE
      },
      AccidentDate: {
        allowNull: false,
        type: DATE
      },
      document: {
        allowNull: false,
        type: STRING
      },
    });
    //FireClaimNotification.sync({force: true})  
    FireClaimNotification.belongsTo(Policy, { foreignKey: 'policyId' });
    //FireClaimNotification.belongsTo(Customer, {foriegnKey: "customerId", as: "Customer"  })

    module.exports = FireClaimNotification


