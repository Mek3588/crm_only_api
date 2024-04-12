const express = require("express");
const router = express.Router();
const {getAgreements, createAgreement, getAgreement , editAgreement, deleteAgreement} = require("./handlers/AgreementsHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getAgreements);
router.route("/:id").get(protectedRoute, getAgreement);
router.route("/").post(protectedRoute, createAgreement);
router.route("/:id").put(protectedRoute, editAgreement);
router.route("/:id").delete(protectedRoute, deleteAgreement);
module.exports = router;