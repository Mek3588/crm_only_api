const express = require("express");
const router = express.Router();
const { getCustomerInputMotors, createCustomerInputMotor, createCustomerInputMotors, getCustomerInputMotor, editCustomerInputMotor, deleteCustomerInputMotor } = require("../handlers/motor/CustomerInputMotorHandler");
const multer = require("multer");
const path = require('path')
const accessRight = require("../middlewares/authorization");
const protectedRoute = require("../middlewares/protectedRoute");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/motorProposal'))
  },
  filename: (req, file, cb) => {
    
    cb(null, Date.now() + path.extname(file.originalname))
  }
})
const upload = multer({ storage: storage }).single('file');

router.route("/").post(protectedRoute, accessRight.canUserCreate(["customerInputMotor"]), upload, createCustomerInputMotor);

router.route("/").get(protectedRoute, accessRight.canUserRead(["customerInputMotor"]), getCustomerInputMotors);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["customerInputMotor"]), getCustomerInputMotor);
// router.route("/").post(protectedRoute, accessRight.canUserCreate(["customer_input_motors"]), upload, createCustomerInputMotor);
//router.route("/").post(upload, createCustomerInputMotor);
router.route("/multiple").post(protectedRoute, accessRight.canUserCreate(["customerInputMotor"]), createCustomerInputMotors);
router.route("/:id").put(protectedRoute,  accessRight.canUserCreate(["customerInputMotor"]),upload, editCustomerInputMotor);
router.route("/:id").delete(protectedRoute, accessRight.canUserCreate(["customerInputMotor"]), deleteCustomerInputMotor);
module.exports = router;
