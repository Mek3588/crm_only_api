const express = require("express");
const router = express.Router();
const {getProducts, createProduct, getProduct , editProduct, deleteProduct} = require("./handlers/ProductsHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getProducts);
router.route("/:id").get(protectedRoute, getProduct);
router.route("/").post(protectedRoute, createProduct);
router.route("/:id").put(protectedRoute, editProduct);
router.route("/:id").delete(protectedRoute, deleteProduct);
module.exports = router;