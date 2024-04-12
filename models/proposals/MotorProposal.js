const { STRING } = require("sequelize");
const { DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const Document = require("../Document");
const Contact = require("../Contact");
const Branch = require("../Branch");
const Quotation = require("../Quotation");
const Opportunity = require("../Opportunity");
const User = require("../acl/user");
// const Proposal = require("./Proposal");
const MotorProposal = sequelize.define("motor_proposals", {
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
        type: STRING,
    },
    typeOfBody: {
        type: STRING
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

    idImage: {
        type: STRING
    },
    videoFootage: {
        type: STRING
    },
    document: {
        type: STRING
    },

    quotationId: {
        type: INTEGER
    },
    // effectiveFrom: {
    //     type: STRING
    // },
    



    // quotationId: {
    //     type: INTEGER,
    // },
    // leadId: {
    //     type: INTEGER
    // },
    // opportunityId: {
    //     type: INTEGER
    // },
    // branchId: {
    //     type: INTEGER
    // },
    // ownerId: {
    //     type: INTEGER
    // }
    // proposalId: {
    //     type: INTEGER
    // }
})
// MoterProposal.belongsTo(Contact)
// MoterProposal.belongsTo(Branch);
// MoterProposal.belongsTo(Quotation);
// MoterProposal.belongsTo(Opportunity);
// MoterProposal.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' })
// MoterProposal.belongsTo()


// MoterProposal.belongsTo(Document);
// Document.belongsTo(MoterProposal)
// MotorProposal.belongsTo(Proposal)
// Proposal.hasOne(MotorProposal)
// MotorProposal.belongsTo(Quotation)
MotorProposal.belongsTo(Quotation);
Quotation.hasMany(MotorProposal)
module.exports = MotorProposal;
