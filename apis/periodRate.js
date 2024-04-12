const express = require("express");
const router = express.Router();
const {
  getPeriodRate,
  getAllPeriodRates,
  createPeriodRate,
  createPeriodRates,
  getPeriodRateByPk,
  editPeriodRate,
  deletePeriodRate,
} = require("./handlers/PeriodRateHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["periodRate"]), getPeriodRate);
router.route("/all").get(protectedRoute, getAllPeriodRates);
router.route("/:id").get(protectedRoute, getPeriodRateByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["periodRates"]), createPeriodRate);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["periodRates"]), createPeriodRates);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["periodRates"]), editPeriodRate);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["periodRates"]), deletePeriodRate);
``;
module.exports = router;
