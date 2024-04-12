const express = require("express");
const { createBus, getBus, getBusByPk, editBus, deleteBus, createBuses } = require("../handlers/quotation/BusHandler");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization")

router.route("/").get(protectedRoute,accessRight.canUserRead(["buses"]), getBus);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["buses"]), getBusByPk);

router.route("/").post(protectedRoute,accessRight.canUserCreate(["buses"]), createBus);


router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["buses"]), editBus);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["buses"]), deleteBus);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["vehicleRateCharts"]), createBuses);
module.exports = router;