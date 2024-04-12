const express = require("express");
const router = express.Router();
const {getLimitedCoverRate, getAllLimitedCoverRates, createLimitedCoverRate, createLimitedCoverRates, getLimitedCoverRateByPk , editLimitedCoverRate, deleteLimitedCoverRate,getLimitedCoverRateByName} = require("../handlers/motor/LimitedCoverRatesHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["limitedCoverRates"]), getLimitedCoverRate);
router.route("/all").get(protectedRoute, getAllLimitedCoverRates);
router.route("/type/:type").get(protectedRoute, getLimitedCoverRateByName);

router.route("/:id").get(protectedRoute, getLimitedCoverRateByPk);
router.route("/").post(protectedRoute, createLimitedCoverRate);
router.route("/multiple").post(protectedRoute, createLimitedCoverRates);
router.route("/:id").put(protectedRoute, editLimitedCoverRate);
router.route("/:id").delete(protectedRoute, deleteLimitedCoverRate);
``
module.exports = router;
