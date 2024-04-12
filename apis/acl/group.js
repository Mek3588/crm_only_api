const express = require("express");
const router = express.Router();
const {getGroup, createGroup, getGroupByPk , editGroup, deleteGroup,createUserGroup,getUserGroupByPk,removeUserGroup} = require("../handlers/acl/GroupHandler");
const protectedRoute = require("../middlewares/protectedRoute");

router.route("/").get(protectedRoute, getGroup);
router.route("/:id").get(protectedRoute, getGroupByPk);   
router.route("/").post(protectedRoute, createGroup);
router.route("/userGroup").put(protectedRoute, createUserGroup);
router.route("/userGroup/:id").get(protectedRoute, getUserGroupByPk);
router.route("/removeUserGroup/:id").delete(protectedRoute, removeUserGroup);
router.route("/:id").put(protectedRoute, editGroup);
router.route("/:id").delete(protectedRoute, deleteGroup);

module.exports = router;