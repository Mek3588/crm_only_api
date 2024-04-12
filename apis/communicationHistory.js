const express = require("express");
const router = express.Router();
const {getCommunicationHistorys, createCommunicationHistory, getCommunicationHistory , editCommunicationHistory, deleteCommunicationHistory} = require("./handlers/CommunicationHistoryHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/:contact_id").get(protectedRoute, getCommunicationHistorys);
router.route("/").post(protectedRoute,createCommunicationHistory);
router.route("/:id").put(protectedRoute, editCommunicationHistory);
router.route("/:id").delete(protectedRoute, deleteCommunicationHistory);
module.exports = router;