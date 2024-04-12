const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");
const { getOtherLoadingAndDiscounts, createOtherLoadingAndDiscounts, getOtherLoadingAndDiscountsByPk, editOtherLoadingAndDiscounts, getOtherLoadingAndDiscountsForCustomer, deleteOtherLoadingAndDiscounts } = require("./handlers/OtherLoadingAndDiscounts");


router.route("/").get(protectedRoute, accessRight.canUserRead(["generalChargeRate"]), getOtherLoadingAndDiscounts);
router.route("/customer").get(getOtherLoadingAndDiscountsForCustomer);

router.route("/:id").get(getOtherLoadingAndDiscountsByPk);
router.route("/").post(createOtherLoadingAndDiscounts);
router.route("/").put(editOtherLoadingAndDiscounts);
router.route("/:id").delete(deleteOtherLoadingAndDiscounts);
module.exports = router;