const express = require('express');
const router = express.Router();

const { createTenderAnalysis, getTenderAnalysis , deleteTenderAnalysis, updateTenderAnalysis,
    getTenderAnalysisByClaimNumber, getTenderAnalysisByBidId,
    getTenderAnalysisByBidderId} = require("../../handlers/motor/TenderAnalysisHandler");

router.route("/").get(getTenderAnalysis);
router.route("/").post(createTenderAnalysis);
router.route("/:id").put(updateTenderAnalysis);
router.route("/:id").delete(deleteTenderAnalysis);
router.route("/:claimNumber").get(getTenderAnalysisByClaimNumber);
router.route("/:bidId").get(getTenderAnalysisByBidId);
router.route("/:bidderId").get(getTenderAnalysisByBidderId);

module.exports = router;

