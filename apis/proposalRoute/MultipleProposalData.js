const express = require("express");
const { getMultipleProposalData } = require("../handlers/motor/MultipleProposalData");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");

// router.route("/").get(protectedRoute, getBsg);
router.route("/:id").get(protectedRoute, getMultipleProposalData);
// router.route("/").post(protectedRoute, createBsg);
// router.route("/:id").put(protectedRoute, editBsg);
// router.route("/:id").delete(protectedRoute, deleteBsg);

module.exports = router;
