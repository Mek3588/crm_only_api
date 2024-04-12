const express = require("express");
const router = express.Router();
const {
  createAgent,
  getAgent,
  editAgent,
  deleteAgent,
  createAgents,
  sendSMS,
  getSMS,
  getEmail,
  sendEmail,
  handleActivation,
  getAgentByPk,
  profileUpload,
  getReportAgent,
  getReports,
  getAllAgents,
} = require("../handlers/agentHandler/AgentHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const upload = require("../../utils/fileUpload").single("profilePicture");
const emailUpload = require("../../utils/fileUpload").array("uploads");
const accessRight = require("../middlewares/authorization");

router
  .route("/sms/:id")
  .get(protectedRoute, accessRight.canUserRead(["agents"]), getSMS);
router
  .route("/email/:id")
  .get(protectedRoute, accessRight.canUserRead(["agents"]), getEmail);
router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead(["agents"]), getAgent);
router
  .route("/getAll")
  .get(protectedRoute, accessRight.canUserRead(["agents"]), getAllAgents);
router
  .route("/:id")
  .get(protectedRoute, accessRight.canUserRead(["agents"]), getAgentByPk);
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["agents"]),
    upload,
    createAgent
  );
router
  .route("/report")
  .post(
    protectedRoute,
    accessRight.canUserRead(["agents"]),
    upload,
    getReportAgent
  );
router
  .route("/report/export")
  .post(
    protectedRoute,
    accessRight.canUserRead(["agents"]),
    upload,
    getReports
  );

router
  .route("/sms")
  .post(protectedRoute, accessRight.canUserCreate(["agents"]), sendSMS);
router
  .route("/activation/:id")
  .get(protectedRoute, accessRight.canUserEdit(["agents"]), handleActivation);
router
  .route("/email")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["agents"]),
    emailUpload,
    sendEmail
  );
router
  .route("/multiple")
  .post(protectedRoute, accessRight.canUserCreate(["agents"]), createAgents);
router
  .route("/")
  .put(protectedRoute, accessRight.canUserEdit(["agents"]), upload, editAgent);

router
  .route("/:id")
  .delete(protectedRoute, accessRight.canUserDelete(["agents"]), deleteAgent);
module.exports = router;
