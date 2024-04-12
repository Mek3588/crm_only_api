const express = require("express");
const router = express.Router();
const {
  getVehicleRateChart,
  createVehicleRateChart,
  getVehicleRateChartByPk,
  editVehicleRateChart,
  deleteVehicleRateChart,
  createVehicleRateCharts,
  getVehicleRateChartsByVehicle,
  getVehicleRateChartsByCountries,
  getAllVehicleRateCharts,
} = require("../handlers/motor/VehicleRateChartsHandler");
const protectedRoute = require("../middlewares/protectedRoute");

router.route("/").get(protectedRoute, getVehicleRateChart);
router.route("/all/:name").get(protectedRoute, getAllVehicleRateCharts);
router.route("/:id").get(protectedRoute, getVehicleRateChartByPk);
router.route("/vehicle/:name").get(protectedRoute, getVehicleRateChartsByVehicle);
router.route("/vehicles").post(protectedRoute, getVehicleRateChartsByCountries);
router.route("/").post(protectedRoute, createVehicleRateChart);
router.route("/multiple").post(protectedRoute, createVehicleRateCharts);

router.route("/:id").put(protectedRoute, editVehicleRateChart);
router.route("/:id").delete(protectedRoute, deleteVehicleRateChart);
``;
module.exports = router;
