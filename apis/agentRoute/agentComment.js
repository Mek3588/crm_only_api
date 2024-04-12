const express = require("express");
const router = express.Router();
const {
  getCommentByAgent,
  deleteAgentComment,
  getComment,
  createAgentComment,
  editAgentComment,
} = require("../handlers/agentHandler/AgentCommentsHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead(["agents"]), getComment);
router
  .route("/:id")
  .get(protectedRoute, accessRight.canUserRead(["agents"]), getCommentByAgent);
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["agents"]),
    createAgentComment
  );
router
  .route("/")
  .put(protectedRoute, accessRight.canUserEdit(["agents"]), editAgentComment);
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["agents"]),
    deleteAgentComment
  );
module.exports = router;
