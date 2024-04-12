const express = require("express");
const router = express.Router();
const {
  createCustomer,
  getCustomer,
  editCustomer,
  deleteCustomer,
  createCustomers,
  sendSMS,
  getSMS,
  getEmail,
  sendEmail,
  handleActivation,
  getCustomerByPk,
  getReports,
  getAllCustomers,
  getCustomerRep,
} = require("../handlers/CustomerHandler/CustomerHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

const upload = require("../../utils/fileUpload").single("profilePicture");
const emailUpload = require("../../utils/fileUpload").array("uploads");

router
  .route("/report/export")
  .post(protectedRoute, accessRight.canUserRead("customers"), getReports);
router
  .route("/report")
  .post(protectedRoute, accessRight.canUserRead("customers"), getCustomerRep);
router
  .route("/sms/:id")
  .get(protectedRoute, accessRight.canUserRead("customers"), getSMS);
router
  .route("/email/:id")
  .get(protectedRoute, accessRight.canUserRead("customers"), getEmail);
router
  .route("/")
  .get(protectedRoute, accessRight.canUserRead("customers"), getCustomer);
router
  .route("/getAll")
  .get(protectedRoute, accessRight.canUserRead("customers"), getAllCustomers);
router
  .route("/:id")
  .get(protectedRoute, accessRight.canUserRead("customers"), getCustomerByPk);
router.route("/").post(
  protectedRoute,
  accessRight.canUserCreate(["customers"]),
  upload,
  createCustomer
);
router
  .route("/sms")
  .post(protectedRoute, accessRight.canUserCreate(["customers"]), sendSMS);
router
  .route("/activation/:id")
  .get(protectedRoute, accessRight.canUserEdit("customers"), handleActivation);
router
  .route("/email")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["customers"]),emailUpload,sendEmail);
router
  .route("/multiple")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["customers"]),
    upload,
    createCustomers
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit("customers"),
    editCustomer
  );
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete("customers"),
    deleteCustomer
  );

module.exports = router;
