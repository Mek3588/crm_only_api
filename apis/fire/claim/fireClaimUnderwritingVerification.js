
const express = require("express");
const router = express.Router();
const path = require('path')
const protectedRoute = require("../../middlewares/protectedRoute");
const accessRight = require("../../middlewares/authorization");
const { getFireClaimUnderwritingVerification, 
    getFireClaimUnderwritingVerificationByPk, 
    createFireClaimUnderwritingVerification, 
    editFireClaimUnderwritingVerification, 
    deleteFireClaimUnderwritingVerification } = require("../../handlers/fire/FireClaimUnderwritingVerificationHandler");

router.route("/").get(protectedRoute, getFireClaimUnderwritingVerification);
router.route("/:id").get(protectedRoute, getFireClaimUnderwritingVerificationByPk);
router.route("/").post(protectedRoute,  createFireClaimUnderwritingVerification);
router.route("/:id").put(protectedRoute, editFireClaimUnderwritingVerification);
router.route("/:id").delete(protectedRoute,deleteFireClaimUnderwritingVerification);
module.exports = router;
