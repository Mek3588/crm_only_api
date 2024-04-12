const accessRight = require("./middlewares/authorization");
const express = require("express");
const router = express.Router();
const {getClaimNotifications,
    createClaimNotification,
    getClaimNotificationByPk,
    editClaimNotification,
    deleteClaimNotification} = require("./handlers/ClaimNotificationHandler");
const protectedRoute = require("./middlewares/protectedRoute");


const upload = require("../utils/fileUpload").single("driverLiscense")


router.route("/").get(protectedRoute, accessRight.canUserRead(["claimNotifications"]), getClaimNotifications);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["claimNotifications"]), getClaimNotificationByPk);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["claimNotifications"]),upload, createClaimNotification);
router.route("/:id").put(protectedRoute, accessRight.canUserRead(["claimNotifications"]), editClaimNotification);
router.route("/:id").delete(protectedRoute, accessRight.canUserRead(["claimNotifications"]), deleteClaimNotification);
router.route("/print/:id").get(protectedRoute, accessRight.canUserRead(["claimNotifications"]), getClaimNotificationByPk);

module.exports = router;
