const express = require("express");
const router = express.Router();
const {
  createPartner,
  getPartner,
  editPartner,
  deletePartner,
  createPartners,
  sendSMS,
  getSMS,
  getEmail,
  sendEmail,
  handleActivation,
  getPartnerByPk,
  profileUpload,
  getReports,
  getAllPartners,
  getPartnerReports,
} = require("../handlers/partnerHandler/PartnerHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const upload = require("../../utils/fileUpload").single("profilePicture");
const emailUpload = require("../../utils/fileUpload").array("uploads");
const accessRight = require("../middlewares/authorization");

router
  .route("/sms/:id")
  .get(protectedRoute, accessRight.canUserRead(["partners"]), getSMS);
router
  .route("/email/:id")
  .get(protectedRoute, accessRight.canUserRead(["partners"]), getEmail);
router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead(["partners"]), getPartner);
router
  .route("/getAll")
  .get(protectedRoute, accessRight.canUserRead(["partners"]), getAllPartners);
router
  .route("/:id")
  .get(protectedRoute, accessRight.canUserRead(["partners"]), getPartnerByPk);
router.route("/").post(protectedRoute, upload, createPartner);

router
  .route("/sms")
  .post(protectedRoute, accessRight.canUserCreate(["partners"]), sendSMS);
router
  .route("/activation/:id")
  .get(
    protectedRoute,
    accessRight.canUserCreate(["partners"]),
    handleActivation
  );
router
  .route("/email")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["partners"]),
    emailUpload,
    sendEmail
  );
router
  .route("/multiple")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["partners"]),
    createPartners
  );
router
  .route("/report")
  .post(
    protectedRoute,
    accessRight.canUserRead(["partners"]),
    getPartnerReports
  );
router
  .route("/report/export")
  .post(protectedRoute, accessRight.canUserRead(["partners"]), getReports);
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["partners"]),
    upload,
    editPartner
  );

router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["partners"]),
    deletePartner
  );
module.exports = router;
