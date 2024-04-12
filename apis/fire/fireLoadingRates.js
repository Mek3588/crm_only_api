const express = require("express");
const router = express.Router();
const {getFireLoadingRate, getAllFireLoadingRates, createFireLoadingRate, createFireLoadingRates, getFireLoadingRateByPk , editFireLoadingRate, deleteFireLoadingRate, allowDuscountFireLoadingRate} = require("../handlers/fire/FireLoadingRatesHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["fireLoadingRates"]), getFireLoadingRate);
router.route("/all").get(protectedRoute, getAllFireLoadingRates);
router.route("/:id").get(protectedRoute, getFireLoadingRateByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["fireLoadingRates"]), createFireLoadingRate);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["fireLoadingRates"]), createFireLoadingRates);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["fireLoadingRates"]), editFireLoadingRate);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["fireLoadingRates"]), deleteFireLoadingRate);
``
router.route("/isDiscount/:id").put(protectedRoute,accessRight.canUserEdit(["fireLoadingRates"]), allowDuscountFireLoadingRate);

module.exports = router;
