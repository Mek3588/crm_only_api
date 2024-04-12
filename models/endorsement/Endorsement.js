const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const CoverRate = require("../CoverRate");


const Endorsement = sequelize.define("endorsements", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    // coverRateId: {
    //     allowNull: false,
    //     type: INTEGER,
    // },
    filePath: {
        type: STRING,
        allowNull: false,
    },
    fileName: {
        type: STRING,
        allowNull: false,
    },
    userId: {
        type: INTEGER
    }

});


// Endorsement.belongsTo(CoverRate)
module.exports = Endorsement;
