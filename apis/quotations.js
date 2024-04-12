const express = require("express");
const router = express.Router();
const accessRight = require("./middlewares/authorization");

const {
  getQuotationsByGroup,
  getQuotations,
  createQuotation,
  getQuotation,
  editQuotation,
  deleteQuotation,
  getQuotationByContactId,
  getAddon,
  generateReport
} = require("./handlers/QuotationsHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, accessRight.canUserRead(["quotations"]), getQuotations);
router.route("/quotationsByGroup").get(protectedRoute, accessRight.canUserRead(["quotations"]), getQuotationsByGroup);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["quotations"]), getQuotation);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["quotations"]), createQuotation);
router.route("/:id").put(protectedRoute, accessRight.canUserEdit(["quotations"]), editQuotation);
router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["quotations"]), deleteQuotation);
router.route("/contact/:id").get(protectedRoute, accessRight.canUserRead(["quotations"]), getQuotationByContactId);

router.route("/addon/:id").get(protectedRoute, accessRight.canUserRead(["quotations"]), getAddon);
router.route("/report").post(protectedRoute, generateReport);

module.exports = router;
