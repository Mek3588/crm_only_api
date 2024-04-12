const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const {
  getRideAndTaxi,
  getRideAndTaxiByPk,
  createRideAndTaxi,
  editRideAndTaxi,
  deleteRideAndTaxi,
  getRideAndTaxiByType
} = require("./handlers/RideAndTaxiHandler");

const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute,accessRight.canUserRead(["rideAndTaxis"]), getRideAndTaxi);
router.route("/:type").get(protectedRoute,accessRight.canUserRead(["rideAndTaxis"]), getRideAndTaxiByType);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["rideAndTaxis"]), getRideAndTaxiByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["rideAndTaxis"]), createRideAndTaxi);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["rideAndTaxis"]), editRideAndTaxi);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["rideAndTaxis"]), deleteRideAndTaxi);

module.exports = router;
