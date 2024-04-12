const express = require("express");
const router = express.Router();
const accessRight = require("./middlewares/authorization");
const {getCampaignTeam, createCampaignTeam, getCampaignTeamByPk,  editCampaignTeam, deleteCampaignTeam, filterCampaignTeam, getCampaignTeamMembers, getSingleTeamMembers, getSingleCampaignTeam, reportCampaignTeam, totalCampaignTeam, getTeamResult, updateExpectedValues, getTeamIndividualCampaigns} = require("./handlers/CampaignTeamHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/single").get(protectedRoute,accessRight.canUserRead(["campaigns/branch","campaigns/teamLeader"]),getSingleCampaignTeam);
router.route("/report").put(protectedRoute,accessRight.canUserEdit(["campaigns/teamLeader"]),reportCampaignTeam);
router.route("/result").get(protectedRoute,accessRight.canUserRead(["campaigns/branch","campaigns/teamLeader"]),getTeamResult);
router.route("/updateExpected").put(protectedRoute,accessRight.canUserEdit(["campaigns/branch"]),updateExpectedValues);
router.route("/individualCampaigns").get(protectedRoute,accessRight.canUserRead(["campaigns/branch","campaigns/teamLeader"]),getTeamIndividualCampaigns);

router.route("/total/:id").get(protectedRoute,accessRight.canUserRead(["campaigns/branch","campaigns/teamLeader"]),totalCampaignTeam);

router.route("/:id").get(protectedRoute,accessRight.canUserRead(["campaigns/branch","campaigns/teamLeader"]), getCampaignTeam);
router.route("/teamMembers/:id").get(protectedRoute,accessRight.canUserRead(["campaigns/branch","campaigns/teamLeader"]), getCampaignTeamMembers);
router.route("/singleTeamMembers/:id").get(protectedRoute,accessRight.canUserRead(["campaigns/branch","campaigns/teamLeader"]),getSingleTeamMembers);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["campaigns/branch","campaigns/teamLeader"]),getCampaignTeamByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["campaigns/branch"]),createCampaignTeam);
router.route("/").put(protectedRoute,accessRight.canUserEdit(["campaigns/branch","teamLeader/headOffice"]),editCampaignTeam);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["campaigns/branch"]),deleteCampaignTeam);
router.route("/search/all").get(protectedRoute,accessRight.canUserRead(["campaigns/branch"]),filterCampaignTeam); 

module.exports = router; 