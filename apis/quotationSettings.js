const express = require("express");
const router = express.Router();
const {getQuotationSettings, createQuotationSetting, getQuotationSetting , editQuotationSetting, deleteQuotationSetting} = require("./handlers/QuotationSettingsHandler");

router.route("/").get(getQuotationSettings);
router.route("/:id").get(getQuotationSetting);
router.route("/").post(createQuotationSetting);
router.route("/:id").put(editQuotationSetting);
router.route("/:id").delete(deleteQuotationSetting);
module.exports = router;