const express = require('express');
const router = express.Router();
const { 
     createClaimVerification,
     getClaimVerifications , 
     editClaimVerification,
    deleteClaimVerification, 
    getClaimVerificationByPk,
     getClaimVerificationById, 
    getClaimVerificationByClaimNumber} = require("../../handlers/motor/ClaimVerificationHandler");
const accessRight = require("../../../utils/Authrizations");
const protectedRoute = require("../../middlewares/protectedRoute");



router.route("/").get(/**(protectedRoute, accessRight.canUserRead(["claimVerifications"])**/getClaimVerifications);
router.route("/:id").get(getClaimVerificationById)
router.route("/").post(createClaimVerification);
router.route("/:id").put(editClaimVerification);
router.route("/:id").delete(deleteClaimVerification);
router.route("/:claimNumber").get(getClaimVerificationByClaimNumber);

module.exports = router;