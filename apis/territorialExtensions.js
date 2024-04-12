const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const {
  getTerritorialExtension,
  getTerritorialExtensionByPk,
  createTerritorialExtension,
  editTerritorialExtension,
  deleteTerritorialExtension,
} = require("./handlers/TerritorialExtentionsHandler");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute,accessRight.canUserRead(["territorialExtensions"]), getTerritorialExtension);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["territorialExtensions"]), getTerritorialExtensionByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["territorialExtensions"]), createTerritorialExtension);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["territorialExtensions"]), editTerritorialExtension);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["territorialExtensions"]), deleteTerritorialExtension);

module.exports = router;
