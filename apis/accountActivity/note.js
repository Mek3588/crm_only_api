const express = require("express");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const {getAccountNote, createAccountNote, getAccountNoteByPk,  editAccountNote, deleteAccountNote, getAccountNoteByUser,getAccountNoteByContact} = require("../handlers/accountActivity/NoteHandler");

/**
 * Note routes
 */
router.route("/").get(protectedRoute,getAccountNote);
router.route("/:id").get(protectedRoute,getAccountNoteByPk);
router.route("/getUserAccountNote/:id").get(protectedRoute,getAccountNoteByUser);
router.route("/getContactAccountNote/:id").get(protectedRoute,getAccountNoteByContact);
router.route("/").post(protectedRoute,createAccountNote);
router.route("/").put(protectedRoute,editAccountNote);
router.route("/:id").delete(protectedRoute,deleteAccountNote);
module.exports = router;

