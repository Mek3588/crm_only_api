const express = require('express');
const router = express.Router();
const { getPoliceReport, getPoliceReportById,
     createPoliceReport, updatePoliceReport, 
     deletePoliceReport, getPoliceReportByClaimNumber, 
     getInjuredPeople,
     getPoliceReportByPlateNumber } = require("../../handlers/motor/PoliceReportHandler");

router.route("/").get(getPoliceReport);
router.route("/:id").get(getPoliceReportById);
router.route("/").post(createPoliceReport);
router.route("/:id").put(updatePoliceReport);
router.route("/:id").delete(deletePoliceReport);
router.route("/:claimNumber").get(getPoliceReportByClaimNumber);
router.route("/:plateNumber").get(getPoliceReportByPlateNumber);
router.route("/injuredPeople/:id").get(getInjuredPeople);

module.exports = router;