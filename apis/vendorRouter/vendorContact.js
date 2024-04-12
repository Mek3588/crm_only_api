const express = require("express");
const router = express.Router();
const {
  getVendorContacts,
  createVendorContact,
} = require("../handlers/vendor/VendorContact");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/:id")
  .get(protectedRoute, accessRight.canUserRead(["vendors"]), getVendorContacts);
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["vendors"]),
    createVendorContact
  );

module.exports = router;
