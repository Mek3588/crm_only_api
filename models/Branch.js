const { STRING } = require("sequelize");
const { BOOLEAN } = require("sequelize");
const { INTEGER } = require("sequelize");
const sequelize = require("../database/connections");
const BranchPhones = require("./BranchPhone");
const BranchSMS = require("./BranchSMS");
const PhoneNo = require("./PhoneNo");
const SMS = require("./SMS");

const Branch = sequelize.define("branches", {
    id: {
        type: INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    branch_code: {
        type: STRING,
        allowNull: false,
    },
    short_code: {
        type: STRING,
    },
    contact_person: {
        type: STRING,
        allowNull: false,
    },
    contact_person2: {
        type: STRING,
    },
    contact_person3: {
        type: STRING,
    },
    office_phone: {
        type: STRING,
        allowNull: false
    },
    office_phone2: {
        type: STRING,
    },
    office_phone3: {
        type: STRING,
    },
    fax_no: {
        type: STRING,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
    },
    longitude: {
        type: STRING,
        allowNull: false
    },
    latitude: {
        type: STRING,
        allowNull: false
    },
    country: {
        type: STRING,
    },
    state: {
        type: STRING,
    },
    city: {
        type: STRING,
    },
    sub_city: {
        type: STRING
    },
    wereda: {
        type: STRING,
    },
    kebele: {
        type: STRING,
    },
    po_box: {
        type: STRING,
    },
    street_name: {
        type: STRING,
    },
    zip_code: {
        type: STRING,
    },
    building: {
        type: STRING,
    },
    office_no: {
        type: STRING,
    },
    website: {
        type: STRING,
    },
    tin_no: {
        type: STRING
    },
    vat_registration_no: {
        type: STRING
    },
    is_main_branch: {
        type: BOOLEAN,
        defaultValue: false
    },
    isBranchActive: {
        type: BOOLEAN,
        defaultValue: false
    }
});
Branch.belongsToMany(PhoneNo, { through: BranchPhones })
PhoneNo.belongsToMany(Branch, { through: BranchPhones });

Branch.belongsToMany(SMS, { through: BranchSMS });
SMS.belongsToMany(Branch, { through: BranchSMS });

module.exports = Branch;
