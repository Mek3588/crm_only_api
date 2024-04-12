const express = require("express");
const router = express.Router();
const {
  getBudgetByPartner,
  deletePartnerBudget,
  editPartnerBudget,
  createPartnerBudget,
} = require("../handlers/partnerHandler/PartnerBudgetHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead(["partners"]),
    getBudgetByPartner
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["partners"]),
    createPartnerBudget
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit(["partners"]),
    editPartnerBudget
  );
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete(["partners"]),
    deletePartnerBudget
  );
module.exports = router;
