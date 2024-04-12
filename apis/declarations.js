const express = require("express");
const router = express.Router();
const {getDeclarations, createDeclaration, getDeclaration , editDeclaration, deleteDeclaration} = require("./handlers/DeclarationsHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getDeclarations);
router.route("/:id").get(protectedRoute, getDeclaration);
router.route("/").post(protectedRoute, createDeclaration);
router.route("/:id").put(protectedRoute, editDeclaration);
router.route("/:id").delete(protectedRoute, deleteDeclaration);
module.exports = router;