const express = require("express");
const router = express.Router();
const {getDailyCashAllowanceCoverRate, getAllDailyCashAllowanceCoverRates, createDailyCashAllowanceCoverRate, createDailyCashAllowanceCoverRates, getDailyCashAllowanceCoverRateByPk ,getDailyCashAllowanceCoverDuplicateRate, editDailyCashAllowanceCoverRate, deleteDailyCashAllowanceCoverRate,getDailyCashAllowanceCoverRateByName, getDailyCashAllowanceCoverRateByDuration} = require("../handlers/motor/DailyCashAllowanceCoverRatesHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["dailyCashAllowanceCoverRates"]), getDailyCashAllowanceCoverRate);
router.route("/duration/:duration").get(protectedRoute, getDailyCashAllowanceCoverRateByDuration);
router.route("/all").get(protectedRoute, getAllDailyCashAllowanceCoverRates);

router.route("/:id").get(protectedRoute, getDailyCashAllowanceCoverRateByPk);
router.route("/").post(protectedRoute, createDailyCashAllowanceCoverRate);
router.route("/filter/").get(protectedRoute, getDailyCashAllowanceCoverDuplicateRate);
router.route("/multiple").post(protectedRoute, createDailyCashAllowanceCoverRates);
router.route("/:id").put(protectedRoute, editDailyCashAllowanceCoverRate);
router.route("/:id").delete(protectedRoute, deleteDailyCashAllowanceCoverRate);
``
module.exports = router;
