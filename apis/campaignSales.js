const express = require("express");
const router = express.Router();
const {getCampaignSales, createCampaignSales, getCampaignSalesByPk,  editCampaignSales, deleteCampaignSales} = require("./handlers/CampaignSalesHandler");
router.route("/").get(getCampaignSales);
router.route("/:id").get(getCampaignSalesByPk);
router.route("/").post(createCampaignSales);
router.route("/").put(editCampaignSales);
router.route("/:id").delete(deleteCampaignSales);
module.exports = router;