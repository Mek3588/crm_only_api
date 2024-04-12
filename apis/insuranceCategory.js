const express = require("express");
const router = express.Router();
const { createInsuranceCategory, getInsuranceCategory,getInsuranceCategoryByPk , editInsuranceCategory, deleteInsuranceCategory} = require("./handlers/InsuranceCategoryHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getInsuranceCategory);
router.route("/:id").get(protectedRoute, getInsuranceCategoryByPk);
router.route("/").post(protectedRoute, createInsuranceCategory);
router.route("/:id").put(protectedRoute, editInsuranceCategory);
router.route("/:id").delete(protectedRoute, deleteInsuranceCategory);
module.exports = router;