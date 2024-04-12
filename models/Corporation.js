const { STRING } = require("sequelize");
const { INTEGER } = require("sequelize");
const Branch = require("./Branch")
const sequelize = require("../database/connections");
const User = require("./acl/user");

const Corporation = sequelize.define("corporations", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    industry: {
        type: STRING,
        allowNull: false,    
    },
    email:{
        type: STRING,
        isUnique: true,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    phone: {
        type: INTEGER,
        allowNullL: false
    },
    address: {
        type: STRING,
        allowNull: false
    },
    business_source: {
    type: STRING,
    allowNull: false
},
    stage: {
        type: STRING,
        allowNull: false
    },
    status: {
        type: STRING,
        allowNull: false
    },
    userId: {
        type: INTEGER
    },
    branchId:{
        type: INTEGER
    }
});

Corporation.belongsTo(Branch)
Corporation.belongsTo(User)
module.exports = Corporation;
