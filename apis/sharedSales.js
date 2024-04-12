const express = require("express");
const router = express.Router();
const {getSharedSales, createSharedSales, getSharedSalesByPk,  editSharedSales, deleteSharedSales} = require("./handlers/SharedSalesHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/:contactId").get(protectedRoute, getSharedSales);
router.route("/:id").get(protectedRoute, getSharedSalesByPk);
router.route("/").post(protectedRoute, createSharedSales);
router.route("/:id").put(protectedRoute, editSharedSales);
router.route("/:id").delete(protectedRoute, deleteSharedSales);
module.exports = router;