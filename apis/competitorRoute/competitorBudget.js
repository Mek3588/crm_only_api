const express = require("express");
const router = express.Router();
const {
  getBudgetByCompetitor,
  deleteCompetitorBudget,
  editCompetitorBudget,
  createCompetitorBudget,
} = require("../handlers/competitorHandler/CompetitorBudgetHandler");
const protectedRoute = require("./../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["competitors"]),
    getBudgetByCompetitor
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["competitors"]),
    createCompetitorBudget
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["competitors"]),
    editCompetitorBudget
  );
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["competitors"]),
    deleteCompetitorBudget
  );
module.exports = router;
