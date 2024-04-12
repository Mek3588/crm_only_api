const express = require("express");
const router = express.Router();
const {getACLs, fetchByGroupId, createACL, getACL , editACL, deleteACL, createACLs} = require("./handlers/ACLHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getACLs);
router.route("/groupId/:id").get(protectedRoute, fetchByGroupId);
router.route("/:id").get(protectedRoute, getACL);
router.route("/").post(protectedRoute, createACL);
router.route("/multiple").post(protectedRoute, createACLs);
router.route("/:id").put(protectedRoute, editACL);
router.route("/:id").delete(protectedRoute, deleteACL);
module.exports = router;