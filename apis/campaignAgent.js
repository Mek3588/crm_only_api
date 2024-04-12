const express = require("express");
const router = express.Router();
const accessRight = require("./middlewares/authorization");
const {getCampaignBranch, createCampaignBranch, getCampaignBranchByPk,  editCampaignBranch, deleteCampaignBranch, filterCampaignBranch, getCampaignBranchMembers, getSingleBranchMembers, getSingleCampaignBranch, reportCampaignBranch, getOneCampaignBranch, totalCampaignBranch, updateExpectedValues, getSingleCampaignAgent, reportCampaignAgent, totalCampaignAgent, getOneCampaignAgent} = require("./handlers/campaignAgentHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/report").put(protectedRoute,accessRight.canUserEdit(["campaigns/agent"]),reportCampaignAgent);
router.route("/singleAgent").get(protectedRoute,accessRight.canUserRead(["campaigns/agent","campaigns/headOffice"]), getSingleCampaignAgent);
router.route("/agentResult").get(protectedRoute,accessRight.canUserRead(["campaigns/agent","campaigns/headOffice"]),getOneCampaignAgent);
router.route("/total/:id").get(protectedRoute,accessRight.canUserRead("campaigns/agent","campaigns/headOffice"),totalCampaignAgent);
router.route("/updateExpected").put(protectedRoute,accessRight.canUserEdit("campaigns/headOffice"),updateExpectedValues);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["campaigns/headOffice"]),createCampaignBranch);
router.route("/").put(protectedRoute,accessRight.canUserEdit(["campaigns/agent","campaigns/headOffice"]),editCampaignBranch);

module.exports = router;