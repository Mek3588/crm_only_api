
const sequelize = require('../../../database/connections')
const { INTEGER, STRING, DOUBLE, DATE } = require('sequelize')
const Customer = require('../../customer/Customer');
const User = require('../../acl/user');
const Document = require("../../Document");
const FireClaimVerification = require('./FireClaimVerification');

const FireClaimUnderwritingVerification = sequelize.define('fire_claim_underwriting_verifications', {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      fireClaimVerificationId: {
        //allowNull: false,
        type: INTEGER
      },
       coverType: {
        type: STRING,
      },
      deductable: {
        type: INTEGER
      },
      policyNumber: {
        type: STRING,
      },
      insured: {
        type: STRING,
      },
      remark: {
        type: STRING
      },
      duration: {
        allowNull: false,
        type: STRING
      },
      sumInsured: {
        //allowNull: false, Previous Claim Record 
        type: INTEGER
      },
      fornow: {
        type: STRING
      },
    });
    //FireClaimUnderwritingVerification.sync({force: true}) 

    FireClaimUnderwritingVerification.belongsTo(FireClaimVerification, {foreignKey: "fireClaimVerificationId"})

    module.exports = FireClaimUnderwritingVerification


