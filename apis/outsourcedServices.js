const express = require("express");
const router = express.Router();
const {setAuthorizations, getOutsourcedServices, createOutsourcedService, getOutsourcedService , editOutsourcedService, deleteOutsourcedService} = require("./handlers/OutsourcedServicesHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getOutsourcedServices);
router.route("/:id").get(protectedRoute, getOutsourcedService);
router.route("/").post(protectedRoute, createOutsourcedService);
router.route("/:id").put(protectedRoute, editOutsourcedService);
router.route("/:id").delete(protectedRoute, deleteOutsourcedService);
router.route("/set_authorizations:path").post(protectedRoute, setAuthorizations);
module.exports = router;