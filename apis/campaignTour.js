const express = require("express");
const router = express.Router();
const {getCampaignTour, createCampaignTour, getCampaignTourByPk,  editCampaignTour, deleteCampaignTour} = require("./handlers/CampaignTourHandler");
router.route("/").get(getCampaignTour);
router.route("/:id").get(getCampaignTourByPk);
router.route("/").post(createCampaignTour);
router.route("/").put(editCampaignTour);
router.route("/:id").delete(deleteCampaignTour);
module.exports = router;