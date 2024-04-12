const express = require("express");
const router = express.Router();
const {getFireConstantFees, getAllFireConstantFeess, createFireConstantFees, createFireConstantFeess, getFireConstantFeesByPk , editFireConstantFees, deleteFireConstantFees} = require("../handlers/fire/FireConstantFeesHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["fireConstantFees"]), getFireConstantFees);
router.route("/all").get(protectedRoute, getAllFireConstantFeess);
router.route("/:id").get(protectedRoute, getFireConstantFeesByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["fireConstantFeess"]), createFireConstantFees);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["fireConstantFeess"]), createFireConstantFeess);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["fireConstantFeess"]), editFireConstantFees);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["fireConstantFeess"]), deleteFireConstantFees);
``
module.exports = router;
