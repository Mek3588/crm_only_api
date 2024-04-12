const { STRING, UUID, UUIDV4, ARRAY } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const SharedMeeting = sequelize.define("shared_meetings", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: INTEGER,
    allowNull: false,
  },
  meetingId: {
    type: INTEGER,
    allowNull: false,
  },
});

module.exports = SharedMeeting;
