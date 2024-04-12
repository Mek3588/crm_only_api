const express = require("express");
const router = express.Router();
const accessRight = require("./middlewares/authorization");
const {getCampaignBranch, createCampaignBranch, getCampaignBranchByPk,  editCampaignBranch, deleteCampaignBranch, filterCampaignBranch, getCampaignBranchMembers, getSingleBranchMembers, getSingleCampaignBranch, reportCampaignBranch, getOneCampaignBranch, totalCampaignBranch, getSingleCampaignAgent, reportCampaignAgent, totalCampaignAgent} = require("./handlers/campaignAgentHandler");
const { updateExpectedValues, getSingleCampaignBroker, editCampaignBroker, reportCampaignBroker, totalCampaignBroker, getOneCampaignBroker, getSinglecampaignbrokers } = require("./handlers/campaignBrokerHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/report").put(protectedRoute,accessRight.canUserEdit(["campaigns/broker"]),reportCampaignBroker);
router.route("/singleBroker").get(protectedRoute, accessRight.canUserRead(["campaigns/broker","campaigns/headOffice"]),getSingleCampaignBroker);
router.route("/singleCampaignBrokers").get(protectedRoute, accessRight.canUserRead(["campaigns/broker","campaigns/headOffice"]),getSinglecampaignbrokers);
router.route("/brokerResult").get(protectedRoute,accessRight.canUserRead(["campaigns/broker","campaigns/headOffice"]), getOneCampaignBroker);
router.route("/total/:id").get(protectedRoute,accessRight.canUserRead("campaigns/broker","campaigns/headOffice"),totalCampaignBroker);
router.route("/updateExpected").put(protectedRoute,accessRight.canUserEdit("campaigns/headOffice"),updateExpectedValues);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["campaigns/headOffice"]),createCampaignBranch);
router.route("/").put(protectedRoute,accessRight.canUserEdit(["campaigns/broker","campaigns/headOffice"]),editCampaignBroker);

module.exports = router;