const express = require("express");
const router = express.Router();
const {getMinimumPremiums, createMinimumPremium, getMinimumPremium , editMinimumPremium, deleteMinimumPremium, getMinimumPremiumsByCategory,getMinimumPremiumsToFire} = require("../handlers/motor/MinimumPremiumHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/fire").get(protectedRoute,getMinimumPremiumsToFire);
router.route("/").get(protectedRoute, accessRight.canUserRead(["minimumPremiums"]), getMinimumPremiums);
router.route("/:id").get(protectedRoute,getMinimumPremium);
router.route("/:category").get(protectedRoute,getMinimumPremiumsByCategory);
router.route("/").post(protectedRoute,createMinimumPremium);
router.route("/:id").put(protectedRoute, editMinimumPremium);
router.route("/:id").delete(protectedRoute, deleteMinimumPremium);
module.exports = router;