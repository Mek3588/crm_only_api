const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const {
  getBusTaxiTp,
  getBusTaxiTpByPk,
  createBusTaxiTp,
  editBusTaxiTp,
  deleteBusTaxiTp,
  getAllBusTaxiTp,
} = require("./handlers/BusTaxiTpHandler");
const accessRight = require("./middlewares/authorization");
router.route("/all").delete(protectedRoute, getAllBusTaxiTp);
router.route("/").get(protectedRoute,accessRight.canUserRead(["busTaxiTps"]), getBusTaxiTp);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["busTaxiTps"]), getBusTaxiTpByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["busTaxiTps"]), createBusTaxiTp);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["busTaxiTps"]), editBusTaxiTp);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["busTaxiTps"]), deleteBusTaxiTp);


module.exports = router;
