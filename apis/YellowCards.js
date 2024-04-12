const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");
const {
  getYellowCard,
  getYellowCardByPk,
  createYellowCard,
  editYellowCard,
  deleteYellowCard,
  getAllYellowCard,
} = require("./handlers/YellowCardHandler");

router.route("/").get(protectedRoute, accessRight.canUserRead(["yellowCards"]), getYellowCard);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["yellowCards"]), getYellowCardByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["yellowCards"]), createYellowCard);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["yellowCards"]), editYellowCard);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["yellowCards"]), deleteYellowCard);
router.route("/all").get(protectedRoute, accessRight.canUserRead(["yellowCards"]), getAllYellowCard);

module.exports = router;
