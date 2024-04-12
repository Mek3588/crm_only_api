const express = require("express");
const router = express.Router();
const {getEventLogByPk, getEventLogs} = require("./handlers/EventLogHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute,accessRight.canUserRead(["eventLogs"]), getEventLogs);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["eventLogs"]), getEventLogByPk);
module.exports = router;
