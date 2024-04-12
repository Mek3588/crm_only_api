const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const User = require("./acl/user");

const AgeLoad = sequelize.define("age_loads", {
    id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,

    },
    made_of: {
    type: STRING,
    allowNull: false,
    },
    min_age: {
    type: INTEGER,
    allowNull: false
    },
    max_age: {
    type: INTEGER,
    allowNull: false,
    },
    load_rate:{
        type: INTEGER,
        allowNull: false
    },
    userId: {
        type: INTEGER,
    },
    
});

AgeLoad.belongsTo(User, { foreignKey: 'userId', as: 'user' })

module.exports = AgeLoad;