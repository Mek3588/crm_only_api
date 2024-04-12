const { STRING, DOUBLE } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");
const User = require("../acl/user");

const DailyCashAllowanceCoverRate = sequelize.define("daily_cash_allowance_cover_rateS", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    benefit: {
        type: DOUBLE,
    },
    duration: {
        type: STRING
    },
    premium: {
        type: DOUBLE
    },
    surcharge: {
        type: DOUBLE
    },
});
// sequelize.sync({ alter: true });

DailyCashAllowanceCoverRate.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = DailyCashAllowanceCoverRate;