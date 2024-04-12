const express = require("express");
const router = express.Router();
const {getRiskType, createRiskType, getRiskTypeByPk,  editRiskType, deleteRiskType} = require("./handlers/RiskTypeHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getRiskType);
router.route("/:id").get(protectedRoute, getRiskTypeByPk);
router.route("/").post(protectedRoute, createRiskType);
router.route("/:id").put(protectedRoute, editRiskType);
router.route("/:id").delete(protectedRoute, deleteRiskType);
module.exports = router;