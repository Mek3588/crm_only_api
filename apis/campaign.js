const express = require("express");
const router = express.Router();
const {getCampaign, createCampaign, getCampaignByPk,  editCampaign, deleteCampaign,getBranchCampaign, getTeamCampaign, getIndividualCampaign, reportCampaign,editCampaignFeaturedAsset, getAgentCampaign, getBrokerCampaign} = require("./handlers/CampaignHandler");
const protectedRoute = require("./middlewares/protectedRoute");

const multer = require("multer");
const path = require("path");

const accessRight = require("./middlewares/authorization");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/campaigns"));
  },
  filename: (req, file, cb) => {
    
    cb( null, Date.now() + file.originalname);  
},
});
 
const upload = multer({ storage: storage }).single("featuredAsset");


router.route("/branch").get(protectedRoute,accessRight.canUserRead(["campaigns/branch"]), getBranchCampaign);
router.route("/team").get(protectedRoute, accessRight.canUserRead(["campaigns/teamLeader"]),getTeamCampaign);
router.route("/individual").get(protectedRoute, accessRight.canUserRead(["campaigns/individual"]), getIndividualCampaign);
router.route("/agent").get(protectedRoute,accessRight.canUserRead(["campaigns/agent"]), getAgentCampaign);
router.route("/broker").get(protectedRoute, accessRight.canUserRead(["campaigns/broker"]), getBrokerCampaign);


router.route("/report").put(protectedRoute,accessRight.canUserEdit(["campaigns/headOffice"]), reportCampaign);

router.route("/").get( getCampaign);
// router.route("/").get(protectedRoute, getCampaign);

router.route("/:id").get(getCampaignByPk);
// router.route("/:id").get(protectedRoute, getCampaignByPk);

router.route("/").post(protectedRoute,accessRight.canUserCreate(["campaigns/headOffice","campaigns/branch"]), createCampaign);
router.route("/").put(protectedRoute,accessRight.canUserEdit(["campaigns/headOffice","campaigns/branch"]), editCampaign);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["campaigns/headOffice","campaigns/branch"]), upload, editCampaignFeaturedAsset);

router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["campaigns/headOffice","campaigns/branch"]), deleteCampaign);

module.exports = router;