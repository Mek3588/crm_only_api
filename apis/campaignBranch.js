const express = require("express");
const router = express.Router();
const accessRight = require("./middlewares/authorization");
const {getCampaignBranch, createCampaignBranch, getCampaignBranchByPk,  editCampaignBranch, deleteCampaignBranch, filterCampaignBranch, getCampaignBranchMembers, getSingleBranchMembers, getSingleCampaignBranch, reportCampaignBranch, getOneCampaignBranch, totalCampaignBranch, updateExpectedValues} = require("./handlers/campaignBranchHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/single").get(protectedRoute,accessRight.canUserRead(["campaigns/branch","campaigns/headOffice"]),getSingleCampaignBranch);
router.route("/report").put(protectedRoute,accessRight.canUserEdit(["campaigns/branch"]),reportCampaignBranch);
router.route("/").get(protectedRoute, accessRight.canUserRead(["campaigns/branch","campaigns/headOffice"]),getCampaignBranch);
router.route("/BranchMembers").get(protectedRoute, accessRight.canUserRead(["campaigns/branch","campaigns/headOffice"]),getCampaignBranchMembers);
router.route("/singleBranchMembers").get(protectedRoute, accessRight.canUserRead(["campaigns/branch","campaigns/headOffice"]),getSingleBranchMembers);
router.route("/branchResult").get(protectedRoute,accessRight.canUserRead(["campaigns/branch","campaigns/headOffice"]),getOneCampaignBranch);
router.route("/total/:id").get(protectedRoute,accessRight.canUserRead(["campaigns/branch","campaigns/headOffice"]),totalCampaignBranch);
router.route("/updateExpected").put(protectedRoute,accessRight.canUserEdit(["campaigns/headOffice"]),updateExpectedValues);
router.route("/").post(protectedRoute, accessRight.canUserEdit(["campaigns/headOffice"]),createCampaignBranch);
router.route("/").put(protectedRoute,accessRight.canUserEdit(["campaigns/branch","campaigns/headOffice"]),editCampaignBranch);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["campaigns/headOffice"]),deleteCampaignBranch);
router.route("/search/all").get(protectedRoute,accessRight.canUserRead(["campaigns/headOffice"]),filterCampaignBranch); 

module.exports = router;
