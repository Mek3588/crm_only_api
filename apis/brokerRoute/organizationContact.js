const express = require("express");
const {
  getOrganizationContacts,
  createOrganizationContact,
} = require("../handlers/brokersHandler/OrganizationContact");
const router = express.Router();

const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["organizations"]),
    getOrganizationContacts
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["organizations"]),
    createOrganizationContact
  );

module.exports = router;
