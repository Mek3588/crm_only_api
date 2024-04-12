"use strict";
const sequelize = require("../../database/connections");
const { INTEGER, STRING, BOOLEAN, DATE } = require("sequelize");
const Sequelize = require("sequelize");
const User = sequelize.define("users", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  corporate_name: {
    type: STRING,
    // allowNull: true,
  },
  first_name: {
    type: STRING,
    // allowNull: true,
  },
  middle_name: {
    type: STRING,
    // allowNull: true,
  },
  last_name: {
    type: STRING,
    // allowNull: true,
  },
  email: {
    type: STRING,
    isUnique: true,
    // allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: STRING,
    isUnique: true,
    allowNull: false,
  },
  gender: {
    type: STRING,
    // allowNull: false,
  },
  password: {
    type: STRING,
    allowNull: false,
  },
  role: {
    type: STRING,
    allowNull: false,
  },
  activated: {
    type: BOOLEAN,
    // allowNull: false,
  },
  activation: {
    type: BOOLEAN,
    // allowNull: false,
  },
  profile_picture: {
    type: STRING,
  },
  shortCode: {
    type: STRING,
  },
  userId: {
    type: INTEGER,
  },
  shortCodeExpirationDate: {
    type: DATE,
  },
});

User.hasOne(User, {
  constraints: false,
});

module.exports = User;
