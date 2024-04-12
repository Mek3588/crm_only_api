const express = require("express");
const router = express.Router();
const {getBranches, getSortedBranches, createBranch, getBranch , editBranch, deleteBranch, createBranches,handleActivation, getActiveBranches, sendSMS, getAllBranches} = require("./handlers/BranchesHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute, getBranches);
router.route("/sorted").get(getSortedBranches);
router.route("/active").get(getActiveBranches);
router.route("/all").get(protectedRoute, getAllBranches);
router.route("/:id").get(protectedRoute, getBranch);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["branches"]), createBranch);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["branches"]), createBranches);
router.route("/sms").post(protectedRoute, sendSMS);
router.route("/handleActivation/:id").get(protectedRoute,accessRight.canUserEdit(["branches"]), handleActivation);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["branches"]), editBranch);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["branches"]), deleteBranch);
module.exports = router;