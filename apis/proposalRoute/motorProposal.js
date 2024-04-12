const express = require("express");
const router = express.Router();
const { getMotorProposal, createMotorProposal, getMotorProposalByPk, editMotorProposal, approveMotorProposal, deleteMotorProposal } = require("../handlers/proposals/MotorProposalHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const multer = require("multer");
const path = require('path')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/motorProposal'))
  },
  filename: (req, file, cb) => {

    
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage }).fields([{ name: 'idImage', maxCount: 1 }, { name: 'videoFootage', maxCount: 1 }, { name: 'document', maxCount: 1 }, { name: 'withholdingDocument', maxCount: 1 }])

router.route("/").get(protectedRoute, getMotorProposal);
router.route("/:id").get(protectedRoute, getMotorProposalByPk);
router.route("/").post(protectedRoute, upload, createMotorProposal);
router.route("/").put(protectedRoute, upload, editMotorProposal);
router.route("/approval").put(protectedRoute, approveMotorProposal);
router.route("/:id").delete(protectedRoute, deleteMotorProposal);
module.exports = router;