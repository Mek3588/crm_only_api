const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const {
  getTipperMotorSpecialTp,
  getTipperMotorSpecialTpByPk,
  createTipperMotorSpecialTp,
  editTipperMotorSpecialTp,
  deleteTipperMotorSpecialTp,
} = require("./handlers/TipperMotorSpecialTpHandler");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute,accessRight.canUserRead(["tipperMotorSpecialTps"]), getTipperMotorSpecialTp);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["tipperMotorSpecialTps"]), getTipperMotorSpecialTpByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["tipperMotorSpecialTps"]), createTipperMotorSpecialTp);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["tipperMotorSpecialTps"]), editTipperMotorSpecialTp);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["tipperMotorSpecialTps"]), deleteTipperMotorSpecialTp);

module.exports = router;
