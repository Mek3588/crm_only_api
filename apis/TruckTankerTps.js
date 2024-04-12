const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const {
  getTruckTankerTp,
  getTruckTankerTpByPk,
  createTruckTankerTp,
  editTruckTankerTp,
  deleteTruckTankerTp,
} = require("./handlers/TruckTankerTpHandler");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute,accessRight.canUserRead(["truckTankerTps"]), getTruckTankerTp);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["truckTankerTps"]), getTruckTankerTpByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["truckTankerTps"]), createTruckTankerTp);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["truckTankerTps"]), editTruckTankerTp);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["truckTankerTps"]), deleteTruckTankerTp);

module.exports = router;
