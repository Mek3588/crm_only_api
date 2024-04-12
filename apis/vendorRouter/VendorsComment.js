const express = require("express");
const router = express.Router();
const {
  getCommentByVendor,
  deleteVendorComment,
  getComment,
  createVendorComment,
  editVendorComment,
} = require("../handlers/vendor/VendorsCommentsHandler");
const protectedRoute = require("./../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead(["vendors"]), getComment);
router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["vendors"]),
    getCommentByVendor
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["vendors"]),
    createVendorComment
  );
router
  .route("/")
  .put(protectedRoute, accessRight.canUserEdit(["vendors"]), editVendorComment);
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["vendors"]),
    deleteVendorComment
  );
module.exports = router;
