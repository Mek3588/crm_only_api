const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const MultipleProposalData = sequelize.define("multiple_proposal_datas", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    quotationId: {
        type: INTEGER,
        allowNull: false,
    },
    multipe_riskId: {
        type: INTEGER
    },
    plate_no: {
        type: STRING
    },
    chasis_no: {
        type: STRING
    },
    engine_no: {
        type: STRING
    },
    librePath: {
        type: STRING
    },
});

module.exports = MultipleProposalData;