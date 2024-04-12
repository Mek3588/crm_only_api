const express = require("express");
const router = express.Router();
const {getGradeLevel, createGradeLevel, getGradeLevelByPk , editGradeLevel, deleteGradeLevel, getAllGradeLevels, createGradeLevels } = require("./handlers/GradeLevelHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization")

router.route("/").get(protectedRoute, getGradeLevel);
router.route("/all").get(protectedRoute, getAllGradeLevels);
router.route("/:id").get(protectedRoute, getGradeLevelByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["gradeLevels"]), createGradeLevel);
router.route("/multiple").post(protectedRoute, createGradeLevels);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["gradeLevels"]), editGradeLevel);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["gradeLevels"]), deleteGradeLevel);
``
module.exports = router;
