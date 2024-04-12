const express = require("express");
const router = express.Router();
const {getSoldServices, createSoldService, getSoldService , editSoldService, deleteSoldService} = require("./handlers/SoldServicesHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute,getSoldServices);
router.route("/:id").get(protectedRoute,getSoldService);
router.route("/").post(protectedRoute, createSoldService);
router.route("/:id").put(protectedRoute,editSoldService);
router.route("/:id").delete(protectedRoute,deleteSoldService);
module.exports = router;