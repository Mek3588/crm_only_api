const express = require("express");
const router = express.Router();
const {getServiceCharge, createServiceCharge, getServiceChargeByPk,  editServiceCharge, deleteServiceCharge} = require("./handlers/ServiceChargesHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["serviceCharge"]), getServiceCharge);
router.route("/:id").get(protectedRoute, getServiceChargeByPk);
router.route("/").post(protectedRoute, createServiceCharge);
router.route("/").put(protectedRoute, editServiceCharge);
router.route("/:id").delete(protectedRoute, deleteServiceCharge);
module.exports = router;