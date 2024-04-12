const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");

const {
  getComprehensiveTp,
  getComprehensiveTpByPk,
  createComprehensiveTp,
  editComprehensiveTp,
  deleteComprehensiveTp,
} = require("./handlers/ComprehensiveTpHandler");

router.route("/").get(protectedRoute, accessRight.canUserRead(["comprehensiveTps"]), getComprehensiveTp);
router.route("/:id").get(protectedRoute, getComprehensiveTpByPk);
router.route("/").post(protectedRoute, createComprehensiveTp);
router.route("/:id").put(protectedRoute, editComprehensiveTp);
router.route("/:id").delete(protectedRoute, deleteComprehensiveTp);

module.exports = router;
