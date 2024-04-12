const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path')
const {
    getProposalComment,
    createProposalComment,
    updateProposalComment
} = require("../handlers/proposals/ProposalCommentHandler");
const accessRight = require("../middlewares/authorization");
const protectedRoute = require("../middlewares/protectedRoute");


router.route("/").get(protectedRoute, accessRight.canUserRead(["proposals"]), getProposalComment);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["proposals"]), createProposalComment);
router.route("/:id").put(protectedRoute, accessRight.canUserEdit(["proposals"]), updateProposalComment);

// router.route("/").get(protectedRoute, accessRight.canUserRead(["proposals"]), getAllProposal);


// router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["proposal"]), deleteCompetitor);
module.exports = router;