const express = require("express");
const router = express.Router();
const {getWarrantys, createWarranty, getWarranty , editWarranty, deleteWarranty} = require("./handlers/WarrantysHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getWarrantys);
router.route("/:id").get(protectedRoute, getWarranty);
router.route("/").post(protectedRoute, createWarranty);
router.route("/:id").put(protectedRoute, editWarranty);
router.route("/:id").delete(protectedRoute, deleteWarranty);
module.exports = router;