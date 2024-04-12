const express = require("express");
const router = express.Router();
const {
  getFireShortPeriodRate,
  getAllFireShortPeriodRates,
  createFireShortPeriodRate,
  createFireShortPeriodRates,
  getFireShortPeriodRateByPk,
  editFireShortPeriodRate,
  deleteFireShortPeriodRate,
} = require("../handlers/fire/FireShortPeriodRateHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["fireConstantFees"]), getFireShortPeriodRate);
router.route("/all").get(protectedRoute, getAllFireShortPeriodRates);
router.route("/:id").get(protectedRoute, getFireShortPeriodRateByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["fireShortPeriodRates"]), createFireShortPeriodRate);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["fireShortPeriodRates"]), createFireShortPeriodRates);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["fireShortPeriodRates"]),editFireShortPeriodRate);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["fireShortPeriodRates"]), deleteFireShortPeriodRate);
``;
module.exports = router;
