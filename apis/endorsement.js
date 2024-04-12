const express = require("express");
const router = express.Router();
const { getEndorsement, getAllEndorsements, createEndorsement, 
    getEndorsementByPk, editEndorsement, deleteEndorsement, getAllFile, 
    createEndorsementByProposal, getEndorsementByProposal, getEndorsementByPolicyId
} = require("./handlers/endorsement/EndorsementHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getEndorsement);
router.route("/getFiles").get(protectedRoute, getAllFile);
router.route("/createEndorsementByProposal").post(protectedRoute, createEndorsementByProposal);

router.route("/getEndorsementByProposal/:id").get(protectedRoute, getEndorsementByProposal)
// router.route("/all").get(protectedRoute, getAllEndorsements);
// router.route("/name/:name").get(protectedRoute, getEndorsementByName);

router.route("/getEndorsementByPolicyId/:id").get(protectedRoute, getEndorsementByPolicyId);
router.route("/:id").get(protectedRoute, getEndorsementByPk);
router.route("/").post(protectedRoute, createEndorsement);

router.route("/:id").put(protectedRoute, editEndorsement);
router.route("/:id").delete(protectedRoute, deleteEndorsement);

module.exports = router;
