const { STRING, INTEGER, DATE } = require("sequelize");
const User = require("../acl/user");
const Contact = require("../Contact");
const sequelize = require("../../database/connections");
const ContactMeetingEmployee = require("../ContactMeetingEmployee");
const Employee = require("../Employee");
const SharedMeeting = require("../SharedMeeting");

const ContactMeeting = sequelize.define("contact_meetings", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  subject: {
    type: STRING,
    allowNull: false,
  },
  startDate: {
    type: DATE,
    allowNull: false,
  },
  startTime: {
    type: DATE,
    allowNull: false,
  },
  dueDate: {
    type: DATE,
    allowNull: false,
  },
  dueTime: {
    type: DATE,
    allowNull: false,
  },
  assignedTo: {
    type: INTEGER,
  },
  meetingUrl: {
    type: STRING,
  },
  status: {
    type: STRING,
  },
  userId: {
    type: INTEGER,
  },

  targetId: {
    type: INTEGER,
  },
  target: {
    type: STRING,
  },
  description: {
    type: STRING,
  },
  type: {
    notNull: false,
    type: STRING,
  },
});

// Contact.hasMany(ContactMeeting);
ContactMeeting.belongsTo(Contact, {
  foreignKey: "targetId",
  as: "contact",
});

User.hasMany(ContactMeeting);
ContactMeeting.belongsTo(User);

ContactMeeting.belongsTo(User, {
  foreignKey: "assignedTo",
  as: "assignedUser",
});

ContactMeeting.belongsToMany(User, {
  through: SharedMeeting,
  foreignKey: "meetingId",
  as: "shares",
});
User.belongsToMany(ContactMeeting, {
  through: SharedMeeting,
  foreignKey: "userId",
  as: "sharedmeetings",
});

Employee.belongsToMany(ContactMeeting, { through: ContactMeetingEmployee });
ContactMeeting.belongsToMany(Employee, { through: ContactMeetingEmployee });

module.exports = ContactMeeting;
