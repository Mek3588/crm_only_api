const express = require("express");
const router = express.Router();
const {
  getCommentByShareholder,
  deleteShareholderComment,
  getComment,
  editShareholderComment,
  createShareholderComment,
} = require("../handlers/shareholderHandler/ShareHolderCommentsHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead(["shareHolders"]), getComment);
router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["shareHolders"]),
    getCommentByShareholder
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["shareHolders"]),
    createShareholderComment
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["shareHolders"]),
    editShareholderComment
  );
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["shareHolders"]),
    deleteShareholderComment
  );
module.exports = router;
