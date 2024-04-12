const express = require('express');
const router = express.Router();
const { createEngineeringRecommendationSurveyRequest, getEngineeringRecommendationSurveyRequest , editEngineeringRecommendationSurveyRequest, deleteEngineeringRecommendationSurveyRequest, getEngineeringRecommendationSurveyRequestByPk, getEngineeringRecommendationSurveyRequestById} = require("../../handlers/motor/EngineeringRecommendationSurveyRequestHandler");

router.route("/").get(getEngineeringRecommendationSurveyRequest);
router.route("/:id").get(getEngineeringRecommendationSurveyRequestById);
router.route("/").post(createEngineeringRecommendationSurveyRequest);
router.route("/:id").put(editEngineeringRecommendationSurveyRequest);
router.route("/:id").delete(deleteEngineeringRecommendationSurveyRequest);

module.exports = router;