const express = require("express");
const router = express.Router();
const {
  createOrganization,
  getOrganization,
  editOrganization,
  deleteOrganization,
  createOrganizations,
  getOrganizationByPk,
  sendSMS,
  getSMS,
  getEmail,
  sendEmail,
  handleActivation,
  getReports,
  getAllOrganizations,
  getReportOrganization,
} = require("../handlers/brokersHandler/OrganizationHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const upload = require("../../utils/fileUpload").single("profilePicture");
const emailUpload = require("../../utils/fileUpload").array("uploads");
const accessRight = require("../middlewares/authorization");

router
  .route("/report/export")
  .post(protectedRoute, accessRight.canUserRead(["organizations"]), getReports);
router
  .route("/report")
  .post(
    protectedRoute,
    accessRight.canUserRead(["organizations"]),
    getReportOrganization
  );
router
  .route("/sms/:id")
  .get(protectedRoute, accessRight.canUserRead(["organizations"]), getSMS);
router
  .route("/email/:id")
  .get(protectedRoute, accessRight.canUserRead(["organizations"]), getEmail);
router
  .route("/")
  .get(
    protectedRoute,
    accessRight.canUserRead(["organizations"]),
    getOrganization
  );
router
  .route("/getAll")
  .get(
    protectedRoute,
    accessRight.canUserRead(["organizations"]),
    getAllOrganizations
  );
router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["organizations"]),
    getOrganizationByPk
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["organizations"]),
    upload,
    createOrganization
  );
router
  .route("/report")
  .post(
    protectedRoute,
    accessRight.canUserRead(["organizations"]),
    upload,
    getReports
  );
router
  .route("/sms")
  .post(protectedRoute, accessRight.canUserCreate(["organizations"]), sendSMS);
router
  .route("/activation/:id")
  .get(
    protectedRoute,
    accessRight.canUserEdit(["organizations"]),
    handleActivation
  );
router
  .route("/email")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["organizations"]),
    emailUpload,
    sendEmail
  );
router
  .route("/multiple")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["organizations"]),
    createOrganizations
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["organizations"]),
    upload,
    editOrganization
  );
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["organizations"]),
    deleteOrganization
  );
module.exports = router;
