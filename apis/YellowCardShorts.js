const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");
const {
  getYellowCardShort,
  getYellowCardShortByPk,
  createYellowCardShort,
  editYellowCardShort,
  deleteYellowCardShort,
} = require("./handlers/YellowCardShortHandler");

router.route("/").get(protectedRoute, accessRight.canUserRead(["yellowCardShorts"]), getYellowCardShort);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["yellowCardShorts"]), getYellowCardShortByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["yellowCardShorts"]), createYellowCardShort);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["yellowCardShorts"]), editYellowCardShort);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["yellowCardShorts"]), deleteYellowCardShort);

module.exports = router;
