const express = require("express");
const router = express.Router();
const {getEmails, createEmail, getEmail, getAllEmails, editEmail, deleteEmail} = require("./handlers/EmailsHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getEmails);
router.route("/all/").get(protectedRoute, getAllEmails);
router.route("/:id").get(protectedRoute,getEmail);
router.route("/").post(protectedRoute,createEmail);
router.route("/:id").put(protectedRoute, editEmail);
router.route("/:id").delete(protectedRoute, deleteEmail);
module.exports = router;