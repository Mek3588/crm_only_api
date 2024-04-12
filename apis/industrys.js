const express = require("express");
const router = express.Router();
const {getIndustry, getAllIndustrys, createIndustry, createIndustrys, getIndustryByPk , editIndustry, deleteIndustry} = require("./handlers/IndustrysHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getIndustry);
router.route("/all").get(protectedRoute, getAllIndustrys);
router.route("/:id").get(protectedRoute, getIndustryByPk);
router.route("/").post(protectedRoute, createIndustry);
router.route("/multiple").post(protectedRoute, createIndustrys);
router.route("/:id").put(protectedRoute, editIndustry);
router.route("/:id").delete(protectedRoute, deleteIndustry);
``
module.exports = router;
