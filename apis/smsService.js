const express = require("express");
const router = express.Router();
const {sendSMS, sendSMSs} = require("./handlers/SMSServiceHandler.js");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").post(protectedRoute, sendSMS);
router.route("/multiple").post(protectedRoute,sendSMSs);

module.exports = router;