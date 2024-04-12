const express = require("express");
const router = express.Router();
const {
  getCommentByPartner,
  deletePartnerComment,
  getComment,
  createPartnerComment,
  editPartnerComment,
} = require("../handlers/partnerHandler/PartnerCommentsHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead(["partners"]), getComment);
router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["partners"]),
    getCommentByPartner
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["partners"]),
    createPartnerComment
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["partners"]),
    editPartnerComment
  );
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["partners"]),
    deletePartnerComment
  );
module.exports = router;
