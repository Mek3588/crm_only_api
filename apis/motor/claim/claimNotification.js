const express = require('express');
const router = express.Router();
const { createClaimNotification, getClaimNotification , editClaimNotification, deleteClaimNotification, getClaimNotificationByClaimNumber} = require("../../handlers/motor/ClaimNotificationHandler");
const accessRight = require("../../../utils/Authrizations");
const protectedRoute = require("../../middlewares/protectedRoute");

// router.route("/").get(getClaimNotifications);
router.route("/").get(getClaimNotification);
router.route("/").post(createClaimNotification);
router.route("/:id").put(/**protectedRoute,accessRight.canUserEdit(["claimNotification"])**/editClaimNotification);
router.route("/:id").delete(deleteClaimNotification); 
router.route("/:claimNumber").get(getClaimNotificationByClaimNumber);
module.exports = router;