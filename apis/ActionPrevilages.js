const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const {
  getActionPrevilage,
  getActionPrevilageByPk,
  createActionPrevilage,
  editActionPrevilage,
  deleteActionPrevilage,
} = require("./handlers/ActionPrevilagesHandler");
const accessRight = require("./middlewares/authorization")

router.route("/").get(protectedRoute,accessRight.canUserRead(["actionPrevilages"]), getActionPrevilage);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["actionPrevilages"]), getActionPrevilageByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["actionPrevilages"]), createActionPrevilage);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["actionPrevilages"]), editActionPrevilage);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["actionPrevilages"]), deleteActionPrevilage);

module.exports = router;
