const express = require("express");
const router = express.Router();
const {
  getShareHolderContacts,
  createShareHolderContact,
} = require("../handlers/shareholderHandler/ShareHolderContact");

const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["shareHolders"]),
    getShareHolderContacts
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["shareHolders"]),
    createShareHolderContact
  );

module.exports = router;
