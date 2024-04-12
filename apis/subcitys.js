const express = require("express");
const router = express.Router();
const {getSubcity, createSubcity, getSubcityByPk , editSubcity,createSubcities, deleteSubcity, getSubcityByCity, getSubcityByCities, getAllSubcitys} = require("./handlers/SubcityHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization")

router.route("/").get(protectedRoute, getSubcity);
router.route("/all").get(protectedRoute, getAllSubcitys);
router.route("/:id").get(protectedRoute, getSubcityByPk);
router.route('/city/:name').get(protectedRoute, getSubcityByCity);
router.route('/cities').post(protectedRoute, getSubcityByCities);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["subcitys"]), createSubcity);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["citys"]), createSubcities);

router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["subcitys"]), editSubcity);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["subcitys"]), deleteSubcity);
``
module.exports = router;
