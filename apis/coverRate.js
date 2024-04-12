const express = require("express");
const router = express.Router();
const {getCoverRate, createCoverRate, getCoverRateByPk,  editCoverRate, deleteCoverRate} = require("./handlers/CoverRateHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["coverRate"]), getCoverRate);
router.route("/:id").get(protectedRoute, getCoverRateByPk);
router.route("/").post(protectedRoute, createCoverRate);
router.route("/").put(protectedRoute, editCoverRate);
router.route("/:id").delete(protectedRoute, deleteCoverRate);
module.exports = router;
