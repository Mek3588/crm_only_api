const express = require("express");
const { getLearner, getLearnerByPk, createLearner, editLearner, deleteLearner } = require("../handlers/quotation/Learner");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute,accessRight.canUserRead(["learners"]), getLearner);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["learners"]), getLearnerByPk);

router.route("/").post(protectedRoute,accessRight.canUserCreate(["learners"]), createLearner);


router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["learners"]), editLearner);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["learners"]), deleteLearner);
module.exports = router;