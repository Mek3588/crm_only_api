const express = require("express");
const router = express.Router();
const { createContactActivityUpdate,
    getContactActivityUpdates,
    editContactActivityUpdate,
    deleteContactActivityUpdate,} = require("./handlers/contactActivity/ContactActivityUpdateHistoryHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/:contact_id").get(protectedRoute, getContactActivityUpdates);
router.route("/").post(protectedRoute,createContactActivityUpdate);
router.route("/:id").put(protectedRoute, editContactActivityUpdate);
router.route("/:id").delete(protectedRoute, deleteContactActivityUpdate);
module.exports = router;