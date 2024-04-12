const express = require("express");
const router = express.Router();
const {getCountry, getAllCountrys, createCountry, createCountrys, getCountryByPk , editCountry, deleteCountry,getCountryByName} = require("./handlers/CountrysHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getCountry);
router.route("/all").get(protectedRoute, getAllCountrys);
router.route("/name/:name").get(protectedRoute, getCountryByName);

router.route("/:id").get(protectedRoute, getCountryByPk);
router.route("/").post(protectedRoute, createCountry);
router.route("/multiple").post(protectedRoute, createCountrys);
router.route("/:id").put(protectedRoute, editCountry);
router.route("/:id").delete(protectedRoute, deleteCountry);
``
module.exports = router;
