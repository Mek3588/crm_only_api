const express = require("express");
const router = express.Router();
const {getSalutation, createSalutation, getSalutationByPk , editSalutation, deleteSalutation, getAllSalutation, createSalutations} = require("./handlers/SalutationHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute, getSalutation);
router.route("/all").get(protectedRoute, getAllSalutation);
router.route("/:id").get(protectedRoute, getSalutationByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["salutations"]), createSalutation);
router.route("/multiple").post(protectedRoute, createSalutations);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["salutations"]), editSalutation);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["salutations"]), deleteSalutation);
``
module.exports = router;
