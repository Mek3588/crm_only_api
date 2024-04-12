const express = require("express");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const {getAccountMeeting, createAccountMeeting, getAccountMeetingByPk,  editAccountMeeting, deleteAccountMeeting,getAccountMeetingByContact} = require("../handlers/accountActivity/MeetingHandler");

/**
 * meeting routes
 */
router.route("/").get(protectedRoute,getAccountMeeting);
router.route("/:id").get(protectedRoute, getAccountMeetingByPk);
router.route("/getContactAccountMeeting/:id").get(protectedRoute,getAccountMeetingByContact);
router.route("/").post(protectedRoute,createAccountMeeting);
router.route("/").put(protectedRoute,editAccountMeeting);
router.route("/:id").delete(protectedRoute,deleteAccountMeeting);
module.exports = router;

