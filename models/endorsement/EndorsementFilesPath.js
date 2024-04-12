const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const CoverRate = require("../CoverRate");
// const Policy = require("../Policy");


const EndorsementFilesPath = sequelize.define("endorsement_files_paths", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    endorsementNo: {
        type: STRING
    },
    filePath: {
        type: STRING
    },
    fileName: {
        type: STRING,
        allowNull: false,
    },
    policyId: {
        type: INTEGER
    },
    isWarranty: {
        type: BOOLEAN,
        default: false
    },

});

// EndorsementFilesPath.belongsTo(Policy)
// Endorsement.belongsTo(CoverRate)
module.exports = EndorsementFilesPath;
