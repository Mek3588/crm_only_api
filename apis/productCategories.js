const express = require("express");
const router = express.Router();
const {getProductCategories, createProductCategory, getProductCategory , editProductCategory, deleteProductCategory} = require("./handlers/ProductCategoriesHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getProductCategories);
router.route("/:id").get(protectedRoute, getProductCategory);
router.route("/").post(protectedRoute, createProductCategory);
router.route("/:id").put(protectedRoute, editProductCategory);
router.route("/:id").delete(protectedRoute, deleteProductCategory);
module.exports = router;