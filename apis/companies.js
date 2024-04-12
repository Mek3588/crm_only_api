const express = require("express");
const router = express.Router();
const {getCompanys, createCompany, createCompanies, getCompany, editCompany, deleteCompany} = require("./handlers/comapnysHandler")
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/:type").get(protectedRoute, getCompanys);
router.route("/:id").get(protectedRoute,getCompany);
router.route("/").post(protectedRoute,createCompany);
router.route("/multiple").post(protectedRoute,createCompanies);
router.route("/:companyId").put(protectedRoute, editCompany);
router.route("/:id").delete(protectedRoute, deleteCompany);
module.exports = router;