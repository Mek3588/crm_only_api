const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");
const {
  getBsg,
  getBsgByPk,
  createBsg,
  createBsgs,
  editBsg,
  handleBsgActivation,
  deleteBsg,
  getAllBsg,
  getAllBsgCharts,
} = require("./handlers/BSGHandler");

router.route("/all").get(protectedRoute, getAllBsg);
router.route("/").get(protectedRoute, accessRight.canUserRead(["bsgs"]), getBsg);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["bsgs"]), getBsgByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["bsgs"]), createBsg);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["bsgs"]), editBsg);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["bsgs"]), deleteBsg);
router.route("/all/:name").get(protectedRoute, getAllBsgCharts);

module.exports = router;
