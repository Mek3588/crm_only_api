
const express = require("express");
const router = express.Router();
const path = require('path')
const { 
    getFireClaimVerification, 
    createFireClaimVerification, 
    editFireClaimVerification, 
    deleteFireClaimVerification,
    handleUnderwritingVerification, 
    getFireClaimVerificationByPk} = require('../../handlers/fire/FireClaimVerificationHandler');
const protectedRoute = require("../../middlewares/protectedRoute");
const accessRight = require("../../middlewares/authorization");

router.route("/").get(protectedRoute, getFireClaimVerification);
router.route("/:id").get(protectedRoute, getFireClaimVerificationByPk);
router.route("/").post(protectedRoute,  createFireClaimVerification);
router.route("/:id").put(protectedRoute, editFireClaimVerification);
router.route("/:id").delete(protectedRoute,deleteFireClaimVerification);
router.route("/verification/underwritingVerification").post(protectedRoute, handleUnderwritingVerification);
module.exports = router;
