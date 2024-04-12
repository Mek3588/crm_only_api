const { INTEGER } = require("sequelize");
const sequelize = require("../../database/connections");

const FireQuotationAdditionalInputsRelation = sequelize.define(
  "fire_quotations_additional_inputs_relations",
  {
    id: {
      type: INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    fireQuotationId: {
      type: INTEGER,
      allowNull: false,
    },
    fireQuotationAdditionalInputId: {
      type: INTEGER,
      allowNull: false,
    },
  }
);

module.exports = FireQuotationAdditionalInputsRelation;
