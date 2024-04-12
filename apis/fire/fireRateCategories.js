const express = require("express");
const router = express.Router();
const {getFireRateCategory, getAllFireRateCategorys, createFireRateCategory, createFireRateCategorys, getFireRateCategoryByPk , editFireRateCategory, deleteFireRateCategory, getFireRateCategoryById} = require("../handlers/fire/FireRateCategoryHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["fireRateCategories"]), getFireRateCategory);
router.route("/single/:id").get(protectedRoute, accessRight.canUserRead(["fireRateCategories"]),  getFireRateCategoryById);
router.route("/all").get(protectedRoute, getAllFireRateCategorys);
router.route("/:id").get(protectedRoute, getFireRateCategoryByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["fireRateCategorys"]), createFireRateCategory);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["fireRateCategorys"]), createFireRateCategorys);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["fireRateCategorys"]), editFireRateCategory);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["fireRateCategorys"]), deleteFireRateCategory);
``
module.exports = router;
 