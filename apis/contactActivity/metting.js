const express = require("express");
const router = express.Router();
const accessRight = require("../middlewares/authorization");
const protectedRoute = require("../middlewares/protectedRoute");
const {
  getMeeting,
  getNotificationAmount,
  createMeeting,
  getMeetingByPk,
  editMeeting,
  deleteMeeting,
  getMeetingByContact,
} = require("../handlers/contactActivity/MeetingHandler");
router.route("/").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getMeeting);
router.route("/amount/:userId").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getNotificationAmount);
router
  .route("/getContactMeeting/:target/:id/:type")
  .get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getMeetingByContact);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["leads", "accounts", "opportunitys"]), createMeeting);
router.route("/").put(protectedRoute, accessRight.canUserEdit(["leads", "accounts", "opportunitys"]), editMeeting);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getMeetingByPk);
router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["leads", "accounts", "opportunitys"]), deleteMeeting);
module.exports = router;
