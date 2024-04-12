const express = require("express");
const router = express.Router();
const {getCampaignHistory, createCampaignHistory, getCampaignHistoryByPk,  editCampaignHistory, deleteCampaignHistory} = require("./handlers/CampaignHistoryHandler");
router.route("/").get(getCampaignHistory);
router.route("/:id").get(getCampaignHistoryByPk);
router.route("/").post(createCampaignHistory);
router.route("/").put(editCampaignHistory);
router.route("/:id").delete(deleteCampaignHistory);
module.exports = router;
