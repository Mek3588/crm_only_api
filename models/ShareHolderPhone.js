const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");

const ShareHolderPhone = sequelize.define("share_holder_phones", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,

    },
    shareHolderId: {
        type: INTEGER,
        allowNull: false
    },
    phoneNoId: {
        type: INTEGER,
        allowNull: false
    }
})
module.exports = ShareHolderPhone