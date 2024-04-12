const express = require("express");
const router = express.Router();
const {getNotification,
    createNotification,
    getNotificationByPk,
    editNotification,
    deleteNotification} = require("./handlers/claim/NotificationHandler");
const protectedRoute = require("./middlewares/protectedRoute");


router.route("/").get(protectedRoute,getNotification);
router.route("/:id").get(protectedRoute,getNotificationByPk);
router.route("/").post(protectedRoute, createNotification);
router.route("/:id").put(protectedRoute,editNotification);
router.route("/:id").delete(protectedRoute,deleteNotification);
module.exports = router;
