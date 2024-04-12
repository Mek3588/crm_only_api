const express = require("express");
const router = express.Router();
const {
  getOpportunitys,
  generateReport,
  createOpportunity,
  getOpportunity,
  editOpportunity,
  deleteOpportunity,
  exportOpportunitys,
} = require("./handlers/OpportunitysHandler");
const accessRight = require("./middlewares/authorization");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute,accessRight.canUserRead(["opportunitys"]), getOpportunitys);
router.route("/export").get(protectedRoute,accessRight.canUserRead(["opportunitys"]), exportOpportunitys);
router.route("/report").post(protectedRoute,accessRight.canUserRead(["opportunitys"]), generateReport);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["opportunitys"]), getOpportunity);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["opportunitys"]), createOpportunity);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["opportunitys"]), editOpportunity);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["opportunitys"]), deleteOpportunity);
module.exports = router;
