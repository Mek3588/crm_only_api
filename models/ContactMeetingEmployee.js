const { INTEGER } = require("sequelize");

const sequelize = require("../database/connections");

const ContactMeetingEmployee = sequelize.define("contact_meeting_employees", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },

    employeeId: {
    type: INTEGER,
    allowNull: false,
  },

  contactMeetingId: {
    type: INTEGER,
    allowNull: false,
  },
});

    

    
    module.exports = ContactMeetingEmployee
