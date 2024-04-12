const express = require("express");
const router = express.Router();
const {getLeads, createLead, getLead , editLead, deleteLead} = require("./handlers/LeadsHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getLeads);
router.route("/:id").get(protectedRoute, getLead);
router.route("/").post(protectedRoute, createLead);
router.route("/:id").put(protectedRoute, editLead);
router.route("/:id").delete(protectedRoute, deleteLead);
module.exports = router;