const express = require("express");
const router = express.Router();
const {getDrivers,createDriver, getDriver, editDriver, deleteDriver,} = require("./handlers/DriverHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getDrivers);
router.route("/:id").get(protectedRoute,getDriver);
router.route("/").post(protectedRoute,createDriver);
router.route("/:id").put(protectedRoute, editDriver);
router.route("/:id").delete(protectedRoute, deleteDriver);
module.exports = router;