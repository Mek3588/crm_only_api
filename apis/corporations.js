const express = require("express");
const router = express.Router();
const {getCorporations, createCorporation, getCorporation , editCorporation, getLeadCorporations, deleteCorporation, getProspectCorporations, getOpportunityCorporations} = require("./handlers/CorporationsHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/:status").get(protectedRoute, getCorporations);
router.route("/prospects").get(protectedRoute, getProspectCorporations);
router.route("/opportunities").get(protectedRoute, getOpportunityCorporations); 
router.route("/leads").get(protectedRoute, getLeadCorporations); 
router.route("/:id").get(protectedRoute,getCorporation);
router.route("/").post(protectedRoute,createCorporation);
router.route("/:id").put(protectedRoute, editCorporation);
router.route("/:id").delete(protectedRoute, deleteCorporation);
module.exports = router;