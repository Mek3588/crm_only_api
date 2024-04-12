const express = require("express");
const router = express.Router();
const {getUpdateHistorys, createUpdateHistory, getUpdateHistory , editUpdateHistory, deleteUpdateHistory} = require("./handlers/UpdateHistoryHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/:contact_id").get(protectedRoute, getUpdateHistorys);
router.route("/").post(protectedRoute,createUpdateHistory);
router.route("/:id").put(protectedRoute, editUpdateHistory);
router.route("/:id").delete(protectedRoute, deleteUpdateHistory);
module.exports = router;