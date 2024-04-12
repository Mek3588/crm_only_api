const express = require("express");
const router = express.Router();
const accessRight = require("./middlewares/authorization");
const {getCampaignIndividual, createCampaignIndividual, getCampaignIndividualByPk,  editCampaignIndividual, deleteCampaignIndividual, filterCampaignIndividual,getSingleCampaignIndividual, reportCampaignIndividual, getIndividualResult, totalCampaignIndividual, updateExpectedValues} = require("./handlers/CampaignIndividualHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/single").get(protectedRoute,accessRight.canUserRead(["campaigns/individual","campaigns/teamLeader"]),getSingleCampaignIndividual);
router.route("/report").put(protectedRoute,accessRight.canUserEdit(["campaigns/individual"]),reportCampaignIndividual);
router.route("/result").get(protectedRoute,accessRight.canUserRead(["campaigns/individual","campaigns/teamLeader"]),getIndividualResult);
router.route("/total/:id").get(protectedRoute,accessRight.canUserRead(["campaigns/headOffice"]),totalCampaignIndividual);
router.route("/updateExpected").put(protectedRoute,accessRight.canUserEdit(["campaigns/teamLeader"]),updateExpectedValues);
router.route("/").get(protectedRoute, accessRight.canUserRead(["campaigns/individual","campaigns/teamLeader"]),getCampaignIndividual);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["campaigns/individual","campaigns/teamLeader"]),getCampaignIndividualByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["campaigns/teamLeader"]),createCampaignIndividual);
router.route("/").put(protectedRoute,accessRight.canUserEdit(["campaigns/individual","campaigns/teamLeader"]),editCampaignIndividual);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["campaigns/teamLeader"]),deleteCampaignIndividual);
router.route("/search/all").get(protectedRoute,accessRight.canUserRead(["campaigns/teamLeader"]),filterCampaignIndividual); 

module.exports = router;