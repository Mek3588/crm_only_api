const express = require("express");
const router = express.Router();
const {
  getShareHolder,
  createShareHolder,
  getShareHolderByPk,
  getExcelTemplate,
  editShareHolder,
  deleteShareHolder,
  createShareHolders,
  getSearchResults,
  handleActivation,
  addPhoneNumber,
  sendEmail,
  sendSMS,
  getEmail,
  getSMS,
  profileUpload,
  getReports,
  getAllShareholders,
  getReportShareholder,
} = require("../handlers/shareholderHandler/ShareHoldersHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const upload = require("./../../utils/fileUpload").single("profilePicture");
const emailUpload = require("../../utils/fileUpload").array("uploads");
const accessRight = require("../middlewares/authorization");

router
  .route("/sms/:id")
  .get(protectedRoute, accessRight.canUserRead(["shareHolders"]), getSMS);
router
  .route("/email/:id")
  .get(protectedRoute, accessRight.canUserRead(["shareHolders"]), getEmail);
router
  .route("/")
  .get(
    protectedRoute,
    accessRight.canUserRead(["shareHolders"]),
    getShareHolder
  );
router
  .route("/getAll")
  .get(
    protectedRoute,
    accessRight.canUserRead(["shareHolders"]),
    getAllShareholders
  );
router
  .route("/handleActivation/:id")
  .get(
    protectedRoute,
    accessRight.canUserEdit(["shareHolders"]),
    handleActivation
  );
router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["shareHolders"]),
    getShareHolderByPk
  );
router
  .route("/sms")
  .post(protectedRoute, accessRight.canUserCreate(["shareHolders"]), sendSMS);
router
  .route("/email")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["shareHolders"]),
    emailUpload,
    sendEmail
  );
router
  .route("/report")
  .post(
    protectedRoute,
    accessRight.canUserRead(["shareHolders"]),
    getReportShareholder
  );
router
  .route("/report/export")
  .post(protectedRoute, accessRight.canUserRead(["shareHolders"]), getReports);
// router.route("/search/:key").get(protectedRoute, getSearchResults);
router
  .route("/template")
  .get(
    protectedRoute,
    accessRight.canUserRead(["shareHolders"]),
    getExcelTemplate
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["shareHolders"]),
    upload,
    createShareHolder
  );
router
  .route("/multiple")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["shareHolders"]),
    createShareHolders
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["shareHolders"]),
    upload,
    editShareHolder
  );

// router.route("/print").post(protectedRoute, printShareHolder);
// router.route("/addPhoneNumber").post(protectedRoute, addPhoneNumber);
router.route("/:id").delete(protectedRoute, deleteShareHolder);
module.exports = router;
