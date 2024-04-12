const express = require("express");
const router = express.Router();
const {
  createCompetitor,
  getCompetitor,
  editCompetitor,
  deleteCompetitor,
  createCompetitors,
  sendSMS,
  getSMS,
  getEmail,
  sendEmail,
  handleActivation,
  getCompetitorByPk,
  getReports,
  getAllCompetitors,
  getCompetitorRep,
} = require("../handlers/competitorHandler/CompetitorHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");


const upload = require("../../utils/fileUpload").single("profilePicture");
const emailUpload = require("../../utils/fileUpload").array("uploads");

router
  .route("/report/export")
  .post(protectedRoute, accessRight.canUserRead(["competitors"]), getReports);
router
  .route("/report")
  .post(
    protectedRoute,
    accessRight.canUserRead(["competitors"]),
    getCompetitorRep
  );
router
  .route("/sms/:id")
  .get(protectedRoute, accessRight.canUserRead(["competitors"]), getSMS);
router
  .route("/email/:id")
  .get(protectedRoute, accessRight.canUserRead(["competitors"]), getEmail);
router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead(["competitors"]), getCompetitor);
router
  .route("/getAll")
  .get(
    protectedRoute,
    accessRight.canUserRead(["competitors"]),
    getAllCompetitors
  );
router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["competitors"]),
    getCompetitorByPk
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["competitors"]),
    upload,
    createCompetitor
  );
router
  .route("/sms")
  .post(protectedRoute, accessRight.canUserCreate(["competitors"]), sendSMS);
router
  .route("/activation/:id")
  .get(
    protectedRoute,
    accessRight.canUserEdit(["competitors"]),
    handleActivation
  );
router
  .route("/email")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["competitors"]),
    emailUpload,
    sendEmail
  );
router
  .route("/multiple")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["competitors"]),
    createCompetitors
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["competitors"]),
    upload,
    editCompetitor
  );
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["competitors"]),
    deleteCompetitor
  );

module.exports = router;
