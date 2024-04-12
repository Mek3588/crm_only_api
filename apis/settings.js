const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");
const {
  getSetting,
  getSettingByPk,
  createSetting,
  createSettings,
  editSetting,
  handleSettingActivation,
  deleteSetting,
} = require("./handlers/SettingsHandler");

router.route("/").get(protectedRoute, accessRight.canUserRead(["settings"]), getSetting);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["settings"]), getSettingByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["settings"]), createSetting);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["settings"]), createSettings);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["settings"]), editSetting);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["settings"]), deleteSetting);

module.exports = router;
