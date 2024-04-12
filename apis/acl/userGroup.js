const express = require("express");
const router = express.Router();
const {getUserGroup, createUserGroup, getUserGroupByPk ,editUserGroup, deleteUserGroup} = require("../handlers/acl/UserGroupHandler");
const protectedRoute = require("../middlewares/protectedRoute");

router.route("/").get(protectedRoute, getUserGroup);
router.route("/:id").get(protectedRoute, getUserGroupByPk);
router.route("/").post(protectedRoute, createUserGroup);
router.route("/").put(protectedRoute, editUserGroup);
router.route("/:id").delete(protectedRoute, deleteUserGroup);
module.exports = router;