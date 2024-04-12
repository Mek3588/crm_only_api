const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path')
const {
    editProposal,
    getProposalByPk,
    getAllProposal,
    getProposalByPlateNo,
    createProposal,
    handleUnderwritingApproval,
    handlePreApprovalCheck,
    handleBranchManager,
    handleSpecialApproval,
    getProposalNotification,
    printProposalByPk,
    getProposalByContactId,
    generateReport
} = require("../handlers/proposals/ProposalHandler");
const accessRight = require("../middlewares/authorization");
const protectedRoute = require("../middlewares/protectedRoute");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads/motorProposal'))
    },
    filename: (req, file, cb) => {

        
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage }).fields([
    { name: 'motor_proposal.idImage', maxCount: 1 },
    { name: 'motor_proposal.videoFootage', maxCount: 1 }, { name: 'motor_proposal.document', maxCount: 1 },
    { name: 'withholdingDocument', maxCount: 1 }, { name: 'withholdingDocument', maxCount: 1 },
    { name: 'tot', maxCount: 1 }, { name: 'tot', maxCount: 1 },
    { name: 'noClaim', maxCount: 1 }
])


router.route("/print/:id").get(protectedRoute, accessRight.canUserRead(["proposals"]), printProposalByPk);
router.route("/proposalNotification").get(protectedRoute, accessRight.canUserRead(["proposals"]), getProposalNotification);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["proposals"]), upload, createProposal);
router.route("/approval/underwritingApproval").post(protectedRoute, accessRight.canUserCreate(["proposals"]), upload, handleUnderwritingApproval);
router.route("/approval/preApproval").post(protectedRoute, accessRight.canUserCreate(["proposals"]), upload, handlePreApprovalCheck);
router.route("/approval/branchManager").post(protectedRoute, accessRight.canUserCreate(["proposals"]), upload, handleBranchManager);
router.route("/approval/specialApproval").post(protectedRoute, accessRight.canUserCreate(["proposals"]), upload, handleSpecialApproval);
router.route("/").put(protectedRoute, accessRight.canUserEdit(["proposals"]), upload, editProposal);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["proposals"]), getProposalByPk);
router.route("/plateno/:plateno").get(protectedRoute, accessRight.canUserRead(["proposals"]), getProposalByPlateNo);
router.route("/").get(protectedRoute, accessRight.canUserRead(["proposals"]), getAllProposal);

router.route("/contact/:id").get(protectedRoute, accessRight.canUserRead(["proposals"]), getProposalByContactId);
router.route("/report").post(protectedRoute, generateReport);

// router.route("/").get(protectedRoute, accessRight.canUserRead(["proposals"]), getAllProposal);


// router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["proposal"]), deleteCompetitor);
module.exports = router;