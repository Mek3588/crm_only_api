const express = require("express");
const router = express.Router();
const {
  getAgentContacts,
  createAgentContact,
} = require("../handlers/agentHandler/AgentContact");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/:id")
  .get(protectedRoute, accessRight.canUserRead(["agents"]), getAgentContacts);
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["agents"]),
    createAgentContact
  );

module.exports = router;
