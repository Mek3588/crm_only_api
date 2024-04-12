const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");
const {getAgeLoades, createAgeLoad, getAgeLoad , editAgeLoad, deleteAgeLoad} = require("./handlers/AgeLoadHandler");

router.route("/").get(protectedRoute, accessRight.canUserRead(["ageLoads"]), getAgeLoades);
router.route("/:id").get(getAgeLoad);
router.route("/").post(createAgeLoad);
router.route("/:id").put(editAgeLoad);
router.route("/:id").delete(deleteAgeLoad);
module.exports = router;