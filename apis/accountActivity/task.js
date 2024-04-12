const express = require("express");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const {getAccountTask, createAccountTask, getAccountTaskByPk,  editAccountTask, deleteAccountTask,getAccountTaskByContact, getAccountTaskByUser,} = require("../handlers/accountActivity/TaskHandler");

/**
 * Task routes
 */
router.route("/").get(protectedRoute,getAccountTask);
router.route("/:id").get(protectedRoute,getAccountTaskByPk);
router.route("/getUserAccountTask/:id").get(protectedRoute,getAccountTaskByUser);
router.route("/getContactAccountTask/:id").get(protectedRoute,getAccountTaskByContact);
router.route("/").post(protectedRoute,createAccountTask);
router.route("/").put(protectedRoute,editAccountTask);
router.route("/:id").delete(protectedRoute,deleteAccountTask);
module.exports = router;
