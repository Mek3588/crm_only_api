const express = require("express");
const router = express.Router();
const {
  createBroker,
  getBroker,
  editBroker,
  deleteBroker,
  createBrokers,
  handleActivation,
  getBrokerByPk,
  //  sendSMS, getSMS, getEmail, sendEmail,
} = require("../handlers/brokersHandler/BrokerHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const upload = require("../../utils/fileUpload").single("profilePicture");
const accessRight = require("../middlewares/authorization");

// router.route("/sms/:id").get(protectedRoute, getSMS);
// router.route("/email/:id").get(protectedRoute, getEmail);
router
  .route("/:id")
  .get(protectedRoute, accessRight.canUserRead(["organizations"]), getBroker);
router
  .route("/broker/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["organizations"]),
    getBrokerByPk
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["organizations"]),
    upload,
    createBroker
  );
// router.route("/sms").post(protectedRoute, sendSMS);
router
  .route("/activation/:id")
  .get(
    protectedRoute,
    accessRight.canUserEdit(["organizations"]),
    handleActivation
  );
// router.route("/email").post(protectedRoute, sendEmail);
router
  .route("/multiple")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["organizations"]),
    createBrokers
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["organizations"]),
    upload,
    editBroker
  );

router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["organizations"]),
    deleteBroker
  );
module.exports = router;
