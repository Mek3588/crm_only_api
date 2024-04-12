const express = require("express");
const router = express.Router();
const {
  getSalesPersons,
  createSalesPerson,
  createSalesPersons,
  getSalesPerson,
  getSalesPersonsByType,
  editSalesPerson,
  deleteSalesPerson,
  getSearchResults,
  getProspectSalesPersons,
  getOpportunitySalesPersons,
  toggleActivation,
} = require("./handlers/SalesPersonHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(getSalesPersons);
router.route("/:id").get(protectedRoute, getSalesPerson);
router.route("/type/:type").get(protectedRoute, getSalesPersonsByType);
router.route("/toggleActivation/:userId").get(protectedRoute, toggleActivation);
router.route("/search/all").get(protectedRoute,getSearchResults); 
router.route("/search/both").get(protectedRoute,getSearchResults); 
router.route("/").post(protectedRoute, createSalesPerson);
router.route("/multiple").post(protectedRoute, createSalesPersons);
router.route("/:id").put(protectedRoute, editSalesPerson);
router.route("/:id").delete(protectedRoute, deleteSalesPerson);
module.exports = router;
