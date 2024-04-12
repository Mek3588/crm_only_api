const express = require("express");
const router = express.Router();
const {
  getRegion,
  createRegion,
  getRegionByPk,
  editRegion,
  deleteRegion,
  createRegions,
  getRegionsByCountry,
  getRegionsByCountries,
  getAllRegions,
} = require("./handlers/RegionHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute, getRegion);
router.route("/all").get(protectedRoute, getAllRegions);
router.route("/:id").get(protectedRoute, getRegionByPk);
router.route("/country/:name").get(protectedRoute, getRegionsByCountry);
router.route("/countries").post(protectedRoute, getRegionsByCountries);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["regions"]), createRegion);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["regions"]), createRegions);

router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["regions"]), editRegion);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["regions"]), deleteRegion);
``;
module.exports = router;
