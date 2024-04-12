const express = require("express");
const router = express.Router();
const {
  getVehicleCategories,
  createVehicleCategory,
  getVehicleCategory,
  editVehicleCategory,
  deleteVehicleCategory,
  getActiveVehicleCategories,
} = require("../handlers/motor/VehicleCategoriesHandler");
const protectedRoute = require("../middlewares/protectedRoute");

router.route("/:id").get(protectedRoute, getVehicleCategories);
router.route("/single/:id").get(protectedRoute, getVehicleCategory);
router.route("/active/:id").get(protectedRoute, getActiveVehicleCategories);
router.route("/").post(protectedRoute, createVehicleCategory);
router.route("/:id").put(protectedRoute, editVehicleCategory);
router.route("/:id").delete(protectedRoute, deleteVehicleCategory);
module.exports = router;
