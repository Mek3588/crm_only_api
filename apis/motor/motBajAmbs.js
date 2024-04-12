const express = require("express");
const router = express.Router();
const {getMotBajAmb, getAllMotBajAmbs, createMotBajAmb, createMotBajAmbs, getMotBajAmbByPk , editMotBajAmb, deleteMotBajAmb,getMotBajAmbByName} = require("../handlers/motor/MotBajAmbsHandler");
const protectedRoute = require("../middlewares/protectedRoute");

router.route("/").get(protectedRoute, getMotBajAmb);
router.route("/all/:name").get(protectedRoute, getAllMotBajAmbs);
router.route("/name/:name").get(protectedRoute, getMotBajAmbByName);

router.route("/:id").get(protectedRoute, getMotBajAmbByPk);
router.route("/").post(protectedRoute, createMotBajAmb);
router.route("/multiple").post(protectedRoute, createMotBajAmbs);
router.route("/:id").put(protectedRoute, editMotBajAmb);
router.route("/:id").delete(protectedRoute, deleteMotBajAmb);
``
module.exports = router;
