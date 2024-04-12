const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const {
  getMultipleRisk,
  getMultipleRiskByPk,
  createMultipleRisk,
  editMultipleRisk,
  deleteMultipleRisk,
} = require("./handlers/MultipleRisksHandler");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["multipleRisks"]), getMultipleRisk);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["multipleRisks"]), getMultipleRiskByPk);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["multipleRisks"]), createMultipleRisk);
router.route("/:id").put(protectedRoute, accessRight.canUserEdit(["multipleRisks"]), editMultipleRisk);
router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["multipleRisks"]), deleteMultipleRisk);

module.exports = router;
