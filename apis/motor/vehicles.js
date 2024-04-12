const express = require("express");
const router = express.Router();
const {getVehicle, getAllVehicles, createVehicle, createVehicles, getVehicleByPk , editVehicle, deleteVehicle,getVehicleByName, getVehiclesByType} = require("../handlers/motor/VehiclesHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["vehicles"]), getVehicle);
router.route("/all").get(protectedRoute, getAllVehicles);
router.route("/name/:name").get(protectedRoute, getVehicleByName);
router.route("/type/:type").get(protectedRoute, getVehiclesByType);
router.route("/:id").get(protectedRoute, getVehicleByPk);
router.route("/").post(protectedRoute, createVehicle);
router.route("/multiple").post(protectedRoute, createVehicles);
router.route("/:id").put(protectedRoute, editVehicle);
router.route("/:id").delete(protectedRoute, deleteVehicle);
``
module.exports = router;
