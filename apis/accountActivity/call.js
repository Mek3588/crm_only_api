const express = require("express");
const router = express.Router();
const { getAccountCall, createAccountCall, getAccountCallByPk,  editAccountCall, deleteAccountCall ,getAccountCallByContact} = require("../handlers/accountActivity/CallHandler");
const protectedRoute = require("../middlewares/protectedRoute");

/**
 * Call routes
 */
router.route("/").get(protectedRoute,getAccountCall);
router.route("/:id").get(protectedRoute, getAccountCallByPk);
router.route("/getContactAccountCall/:id").get(protectedRoute,getAccountCallByContact);
router.route("/").post(protectedRoute,createAccountCall);
router.route("/").put(protectedRoute,editAccountCall);
router.route("/:id").delete(protectedRoute,deleteAccountCall);
module.exports = router;

