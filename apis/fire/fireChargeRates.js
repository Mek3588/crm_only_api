const express = require("express");
const router = express.Router();
const {getFireChargeRate, createFireChargeRate, getFireChargeRateByPk,  editFireChargeRate, deleteFireChargeRate} = require("../handlers/fire/FireChargeRateHandler");

//routes
router.route("/").get(getFireChargeRate);
router.route("/:id").get(getFireChargeRateByPk);
router.route("/").post(createFireChargeRate);
router.route("/").put(editFireChargeRate);
router.route("/:id").delete(deleteFireChargeRate);
module.exports = router;