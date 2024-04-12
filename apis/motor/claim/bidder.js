const express = require('express');
const router = express.Router();
const { createBidder, getBidder ,
     editBidder, deleteBidder,
    getBidderByClaimNumber, getBidderByBidId} = require("../../handlers/motor/BidderHandler");


router.route("/").get(getBidder);
router.route("/").post(createBidder);
router.route("/:id").put(editBidder);
router.route("/:id").delete(deleteBidder);
router.route("/:claimNumber").get(getBidderByClaimNumber);
router.route("/:bidId").get(getBidderByBidId);

module.exports = router;