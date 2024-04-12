const express = require('express');
const router = express.Router();
const { createUnderWritingClaimVerification, createUnderWritingClaimVerifications, getUnderWritingClaimVerification , 
    getUnderWritingClaimVerificationByPk, editUnderWritingClaimVerification, deleteUnderWritingClaimVerification, 
    getUnderWritingClaimVerificationByClaimVerificationId, getUnderWritingClaimVerificationByCustomerId,} 
    = require("../../handlers/motor/UnderwritingClaimVerificationHandler");

router.route("/").get(getUnderWritingClaimVerification);
router.route("/:id").get(getUnderWritingClaimVerificationByPk);
router.route("/").post(createUnderWritingClaimVerification);
router.route("/multiple").post(createUnderWritingClaimVerifications);
router.route("/:id").put(editUnderWritingClaimVerification);
router.route("/:id").delete(deleteUnderWritingClaimVerification);
router.route("/byCustomerId/:customerId").get(getUnderWritingClaimVerificationByCustomerId);
router.route("/claimVerification/:id").get(getUnderWritingClaimVerificationByClaimVerificationId);


module.exports = router;