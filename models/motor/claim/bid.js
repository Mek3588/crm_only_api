const sequelize = require("../../../database/connections");
const { INTEGER, STRING, DOUBLE, DATE, BOOLEAN } = require("sequelize");
const Bidder = require('./Bidder')
const ClaimNotification = require('./ClaimNotification')

const Bid = sequelize.define("bids", {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bidId:{
    type:STRING
  },
  claimNo:{
    type:STRING
  },
  initialBidPrice: {
    type: DECIMAL,
  },
  vehicleType: {
    type: STRING,
  },
  damagedPart: { 
    type: STRING
 },
  repairTime: { 
    type: STRING
},
  coverType: { 
    type: STRING 
},

  createdAt: {
    type: DATE,
  },
  updatedAt: {
    type: DATE,
  },
});

Bid.hasMany(ClaimNotification, { foreignKey: "claimNo",as:"ClaimNotifications" });

module.exports = Bid;
