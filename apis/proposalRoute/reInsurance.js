const express = require("express");
const router = express.Router();

const path = require('path')
const {
    getReInsurance,
    getAllReInsurances,
    createReInsurance,
    createReInsurances,
    getReInsuranceByPk,
    editReInsurance,
    deleteReInsurance,
} = require("../handlers/proposals/ReInsuranceHandler");
const accessRight = require("../middlewares/authorization");
const protectedRoute = require("../middlewares/protectedRoute");


router.route("/").post(protectedRoute, accessRight.canUserCreate(["reInsurance"]), createReInsurance);
router.route("/multiple").post(protectedRoute, accessRight.canUserCreate(["reInsurance"]), createReInsurances);

router.route("/").put(protectedRoute, accessRight.canUserEdit(["reInsurance"]), editReInsurance);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["reInsurance"]), getReInsuranceByPk);
router.route("/").get(protectedRoute, accessRight.canUserRead(["reInsurance"]), getReInsurance);

// router.route("/").get(protectedRoute, accessRight.canUserRead(["reInsurance"]), getAllReInsurance);


router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["reInsurance"]), deleteReInsurance);
module.exports = router;