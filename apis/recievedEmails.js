const express = require("express");
const router = express.Router();
const {getRecievedEmail, getAllRecievedEmails, getRecievedEmailsByUser } = require("./handlers/RecievedEmailsHandler");
const protectedRoute = require("./middlewares/protectedRoute");



router.route("/").get(protectedRoute, getRecievedEmail);
router.route("/all").get(protectedRoute, getAllRecievedEmails);
router.route("/from/:from").get(protectedRoute,getRecievedEmailsByUser);

module.exports = router;