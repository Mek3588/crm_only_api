const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path')

const { getFireProposal,
    createFireProposal,
    getFireProposalByPk,
    editFireProposal,
    deleteFireProposal,
    getAllFireProposals,
    underWritingApproval,
    financeApproval,
    reInsuranceApproval,
    hasPrivilege,
    generatePolicy,
} = require("./handlers/proposals/FireProposalHandler");

const storage = multer.diskStorage({ 
    destination:(req,file,cb)=>{
      cb(null, path.join(__dirname, '../uploads/fireProposal'))
     
    },
    filename:(req,file,cb) =>{
      
      cb(null,Date.now() + path.extname(file.originalname))
    }
  })
  const upload= multer({storage:storage}).fields([
    { name: 'motor_proposal.idImage', maxCount: 1 },
    { name: 'motor_proposal.videoFootage', maxCount: 1 }, { name: 'motor_proposal.document', maxCount: 1 },
    { name: 'withholdingDocument', maxCount: 1 }, { name: 'withholdingDocument', maxCount: 1 },
    { name: 'tot', maxCount: 1 }, { name: 'tot', maxCount: 1 },
    { name: 'noClaim', maxCount: 1 },
    { name: 'fire_proposal.idImage', maxCount: 1 },
    { name: 'fire_proposal.document', maxCount: 1 },

])
  

const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getFireProposal);
router.route("/all").get(protectedRoute, getAllFireProposals);
router.route("/hasPrivilege").get(protectedRoute, hasPrivilege);
router.route("/:id").get(protectedRoute, getFireProposalByPk);
router.route("/").post(protectedRoute, upload, createFireProposal);
router.route("/:id").put(protectedRoute, upload, editFireProposal);
router.route("/underWrittingApproval/:id").put(protectedRoute, underWritingApproval);
router.route("/reInsuranceApproval/:id").put(protectedRoute, reInsuranceApproval);
router.route("/financeApproval/:id").put(protectedRoute, financeApproval);

router.route("/:id").delete(protectedRoute, deleteFireProposal);
module.exports = router;
