const express = require("express");
const router = express.Router();
const {getCustomers, getInsuredCustomers, getLeads ,createCustomer, getCustomer , editCustomer, deleteCustomer} = require("./handlers/customers/CustomersHandler");
const protectedRoute = require("./middlewares/protectedRoute");

/**
 * coustomer routes
 */
router.route("/").get(protectedRoute, getCustomers);
router.route("/insuredCustomers").get(protectedRoute, getInsuredCustomers);
router.route("/leads").get(protectedRoute, getLeads);
router.route("/:id").get(protectedRoute,getCustomer);
router.route("/").post(protectedRoute,createCustomer);
router.route("/:id").put(protectedRoute, editCustomer);
router.route("/:id").delete(protectedRoute, deleteCustomer);
module.exports = router;