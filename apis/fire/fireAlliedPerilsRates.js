const express = require("express");
const router = express.Router();
const {
  getFireAlliedPerilsRate,
  getAllFireAlliedPerilsRates,
  createFireAlliedPerilsRate,
  createFireAlliedPerilsRates,
  getFireAlliedPerilsRateByPk,
  editFireAlliedPerilsRate,
  deleteFireAlliedPerilsRate,
} = require("../handlers/fire/FireAlliedPerilsRateHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["fireAlliedPerilsRate"]), getFireAlliedPerilsRate);
router.route("/all").get(protectedRoute, getAllFireAlliedPerilsRates);
router.route("/:id").get(protectedRoute, getFireAlliedPerilsRateByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["fireAlliedPerilsRates"]), createFireAlliedPerilsRate);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["fireAlliedPerilsRates"]), createFireAlliedPerilsRates);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["fireAlliedPerilsRates"]), editFireAlliedPerilsRate);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["fireAlliedPerilsRates"]), deleteFireAlliedPerilsRate);
``;
module.exports = router;
