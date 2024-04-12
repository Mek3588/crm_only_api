const express = require("express");
const router = express.Router();
const {
  getProposalByCustomer,
  deleteCustomerProposal,
  editCustomerProposal,
  createCustomerProposal,
  createCustomerWithProposal,
} = require("../handlers/CustomerHandler/CustomerProposalHandler");
const protectedRoute = require("./../middlewares/protectedRoute");

router.route("/:id").get(protectedRoute, getProposalByCustomer);
router.route("/").post(protectedRoute, createCustomerProposal);
router.route("/multiple").post(protectedRoute, createCustomerWithProposal);
router.route("/").put(protectedRoute, editCustomerProposal);
router.route("/:id").delete(protectedRoute, deleteCustomerProposal);
module.exports = router;
