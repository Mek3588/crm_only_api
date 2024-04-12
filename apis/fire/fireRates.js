const express = require("express");
const router = express.Router();
const { getFireRate, createFireRate, getFireRateByPk, editFireRate, deleteFireRate, getAllFireRates, getFireRatesByCategory } = require("../handlers/fire/FireRatesHandler");
const protectedRoute = require("../../apis/middlewares/protectedRoute")
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["fireRates"]), getFireRate);
router.route('/all').get(getAllFireRates);
router.route("/category/:categoryId").get(getFireRatesByCategory);
router.route("/:id").get(getFireRateByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["fireRates"]),createFireRate);
router.route("/:id").put(protectedRoute, editFireRate);
router.route("/:id").delete(deleteFireRate);
module.exports = router;