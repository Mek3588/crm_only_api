const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const {
  getMultipleFireRisk,
  getMultipleFireRiskByPk,
  createMultipleFireRisk,
  editMultipleFireRisk,
  deleteMultipleFireRisk,
} = require("./handlers/fire/FireMultipleRisksHandler");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute,accessRight.canUserRead(["multipleFireRisks"]), getMultipleFireRisk);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["multipleFireRisks"]), getMultipleFireRiskByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["multipleFireRisks"]), createMultipleFireRisk);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["multipleFireRisks"]), editMultipleFireRisk);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["multipleFireRisks"]), deleteMultipleFireRisk);

module.exports = router;
