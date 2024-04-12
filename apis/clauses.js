const express = require("express");
const router = express.Router();
const {getClauses, createClause, getClause , editClause, deleteClause} = require("./handlers/ClausesHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getClauses);
router.route("/:id").get(protectedRoute, getClause);
router.route("/").post(protectedRoute, createClause);
router.route("/:id").put(protectedRoute, editClause);
router.route("/:id").delete(protectedRoute, deleteClause);
module.exports = router;