const express = require("express");
const router = express.Router();
const {
  getCommentByCompetitor,
  deleteCompetitorComment,
  getComment,
  createCompetitorComment,
  editCompetitorComment,
} = require("../handlers/competitorHandler/CompetitorCommentsHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead(["competitors"]), getComment);
router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["competitors"]),
    getCommentByCompetitor
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["competitors"]),
    createCompetitorComment
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["competitors"]),
    editCompetitorComment
  );
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["competitors"]),
    deleteCompetitorComment
  );
module.exports = router;
