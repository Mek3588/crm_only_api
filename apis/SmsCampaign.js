const express = require("express");
const router = express.Router();
const {sendSMS, sendSMSs} = require("./handlers/SMSServiceHandler.js");
const protectedRoute = require("./middlewares/protectedRoute");
// import { getSmsCampaign } from "./handlers/SmsCampaignHandler.js";
const {getSmsCampaign} = require("./handlers/SmsCampaignHandler")

router.route("/").get(protectedRoute, getSmsCampaign);
// router.route("/multiple").post(protectedRoute,sendSMSs);

module.exports = router;