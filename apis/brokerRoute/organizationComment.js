const express = require("express");
const router = express.Router();
const {
  getCommentByOrganization,
  deleteOrganizationComment,
  getComment,
  createOrganizationComment,
  editOrganizationComment,
} = require("../handlers/brokersHandler/OrganizationCommentsHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead(["organizations"]), getComment);
router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["organizations"]),
    getCommentByOrganization
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["organizations"]),
    createOrganizationComment
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["organizations"]),
    editOrganizationComment
  );
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["organizations"]),
    deleteOrganizationComment
  );
module.exports = router;
