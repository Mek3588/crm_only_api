const express = require("express");
const router = express.Router();
const {
  getCity,
  createCity,
  getCityByPk,
  editCity,
  deleteCity,
  getCityByRegion,
  getCityByRegions,
  getAllCitys,
  createCities,
} = require("./handlers/CitysHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");


router.route("/").get(protectedRoute, getCity);
router.route("/all").get(protectedRoute, getAllCitys)
router.route("/:id").get(protectedRoute, getCityByPk);
router.route('/region/:name').get(protectedRoute, getCityByRegion);
router.route('/regions').post(protectedRoute, getCityByRegions); 
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["citys"]), createCities); 

router.route("/").post(protectedRoute,accessRight.canUserCreate(["citys"]), createCity);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["citys"]), editCity);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["citys"]), deleteCity);

module.exports = router;
