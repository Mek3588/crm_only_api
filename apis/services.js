const express = require("express");
const router = express.Router();
const {getServices, createService, getService , editService, deleteService} = require("./handlers/ServicesHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getServices);
router.route("/:id").get(protectedRoute, getService);
router.route("/").post(protectedRoute, createService);
router.route("/:id").put(protectedRoute, editService);
router.route("/:id").delete(protectedRoute, deleteService);
module.exports = router;