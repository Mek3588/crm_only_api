const express = require("express");
const router = express.Router();
const {
  getVendors,
  createVendor,
  getVendor,
  editVendor,
  deleteVendor,
  createVendors,
  sendSMS,
  getSMS,
  getEmail,
  sendEmail,
  handleActivation,
  profileUpload,
  getReports,
  getAllVendors,
  getReportVendor,
} = require("../handlers/vendor/VendorsHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const upload = require("./../../utils/fileUpload").single("profilePicture");
const emailUpload = require("../../utils/fileUpload").array("uploads");
const accessRight = require("../middlewares/authorization");

router
  .route("/sms/:id")
  .get(protectedRoute, accessRight.canUserRead(["vendors"]), getSMS);
router
  .route("/email/:id")
  .get(protectedRoute, accessRight.canUserRead(["vendors"]), getEmail);
router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead(["vendors"]), getVendors);
router
  .route("/getAll")
  .get(protectedRoute, accessRight.canUserRead(["vendors"]), getAllVendors);
router
  .route("/:id")
  .get(protectedRoute, accessRight.canUserRead(["vendors"]), getVendor);
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["vendors"]),
    upload,
    createVendor
  );
router
  .route("/sms")
  .post(protectedRoute, accessRight.canUserCreate(["vendors"]), sendSMS);
router
  .route("/report/export")
  .post(protectedRoute, accessRight.canUserRead(["vendors"]), getReports);
router
  .route("/report")
  .post(protectedRoute, accessRight.canUserRead(["vendors"]), getReportVendor);
router
  .route("/activation/:id")
  .get(protectedRoute, accessRight.canUserEdit(["vendors"]), handleActivation);
router
  .route("/email")
  .post(
    protectedRoute,
    accessRight.canUserRead(["vendors"]),
    emailUpload,
    sendEmail
  );
router
  .route("/multiple")
  .post(protectedRoute, accessRight.canUserCreate(["vendors"]), createVendors);
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["vendors"]),
    upload,
    editVendor
  );

router.route("/:id").delete(protectedRoute, deleteVendor);
module.exports = router;
