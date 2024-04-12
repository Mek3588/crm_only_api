const express = require("express");
const router = express.Router();
const { getContactContacts,
  createContactContact,

} = require("./handlers/ContactCompanyContact");
const protectedRoute = require("./middlewares/protectedRoute");


router.route("/:id").get(protectedRoute, getContactContacts);
router.route("/").post(protectedRoute, createContactContact);

module.exports = router; 