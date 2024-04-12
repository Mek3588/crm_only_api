const express = require("express");
const router = express.Router();
const {
  getPartnerContacts,
  createPartnerContact,
} = require("../handlers/partnerHandler/PartnerContact");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["partners"]),
    getPartnerContacts
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["partners"]),
    createPartnerContact
  );

module.exports = router;
