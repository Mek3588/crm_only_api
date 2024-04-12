const sequelize = require("../database/connections");
const { INTEGER, STRING, DOUBLE, DATE, BOOLEAN } = require('sequelize')
const Customer = require("../models/customer/Customer")

const TodoList = sequelize.define('todoLists', {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    taskName: {
        type: STRING,
    },
    taskDescription: {
        type: STRING,
    },
    taskDate: {
        type: STRING,
    },
    taskTime: {
        type: STRING,
    },
    taskStatus: {
        type: STRING,
    },
    taskPriority: {
        type: STRING,
    },
    taskCompleted: {
        type: BOOLEAN,
    },
    taskDeleted: {
        type: BOOLEAN,
    },
    customerId: {
        type: INTEGER,
    },
    userId: {
        type: INTEGER,
    },
    createdAt: {
        type: DATE,
    },
    updatedAt: {
        type: DATE,
    },

})


TodoList.belongsTo(Customer);

module.exports = TodoList;