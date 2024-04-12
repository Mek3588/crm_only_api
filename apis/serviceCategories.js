const express = require("express");
const router = express.Router();
const {getServiceCategories, createServiceCategory, getServiceCategory , editServiceCategory, deleteServiceCategory} = require("./handlers/ServiceCategoriesHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getServiceCategories);
router.route("/:id").get(protectedRoute, getServiceCategory);
router.route("/").post(protectedRoute, createServiceCategory);
router.route("/:id").put(protectedRoute, editServiceCategory);
router.route("/:id").delete(protectedRoute, deleteServiceCategory);
module.exports = router;