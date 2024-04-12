const { STRING, INTEGER } = require("sequelize");
const User = require("../acl/user");
const sequelize = require("../../database/connections");

const CustomerNote = sequelize.define("customer_notes", {
  id: {
    type: INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  note: {
    type: STRING,
    allowNull: false,
  },
  comment: {
    type: STRING,
  },
  createdDate: {
    type: STRING,
    allowNull: false,
  },
  userId: {
    type: INTEGER,
  },
  reportTo: {
    type: INTEGER,
  },
  targetId: {
    type: INTEGER,
  },
  target: {
    type: STRING,
    },
  customerId: {
      type: INTEGER
  }
});

Customer.hasMany(CustomerNote)
CustomerNote.belongsTo(Customer)

User.hasMany(CustomerNote);
CustomerNote.belongsTo(User);

module.exports = CustomerNote;
