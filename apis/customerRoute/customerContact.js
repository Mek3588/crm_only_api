const express = require("express");
const router = express.Router();
const { getCustomerContacts,
  createCustomerContact,

} = require("../handlers/CustomerHandler/CustomerContact");
const protectedRoute = require("../middlewares/protectedRoute");


router.route("/:id").get(protectedRoute, getCustomerContacts);
router.route("/").post(protectedRoute, createCustomerContact);

module.exports = router; 