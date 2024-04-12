const express = require("express");
const router = express.Router();
const {
  getCompetitorContacts,
  createCompetitorContact,
} = require("../handlers/competitorHandler/CompetitorContact");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserEdit(["competitors"]),
    getCompetitorContacts
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["competitors"]),
    createCompetitorContact
  );

module.exports = router;
