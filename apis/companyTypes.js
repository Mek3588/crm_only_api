const express = require("express");
const router = express.Router();
const {getCompanyTypes, createCompanyType, getCompanyType , editCompanyType, deleteCompanyType} = require("./handlers/CompanyTypesHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getCompanyTypes);
router.route("/:id").get(protectedRoute, getCompanyType);
router.route("/").post(protectedRoute, createCompanyType);
router.route("/:id").put(protectedRoute, editCompanyType);
router.route("/:id").delete(protectedRoute, deleteCompanyType);
module.exports = router;