
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require('path')
const { 
    getFireClaimNotification, 
    createFireClaimNotification, 
    editFireClaimNotification, 
    deleteFireClaimNotification, 
    getFireClaimNotificationByPk} = require('../../handlers/fire/FireClaimNotificationHandler');
const protectedRoute = require("../../middlewares/protectedRoute");
const accessRight = require("../../middlewares/authorization");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../../uploads/fireClaimLetters'))
  },
  filename: (req, file, cb) => {

      
      cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage }).fields([ { name: 'document', maxCount: 1 }])
//const upload = require("../../../utils/fileUpload").single("document");

router.route("/").get(protectedRoute, getFireClaimNotification);
router.route("/:id").get(protectedRoute, getFireClaimNotificationByPk);
router.route("/").post(protectedRoute, upload, createFireClaimNotification);
router.route("/:id").put(protectedRoute, editFireClaimNotification);
router.route("/:id").delete(protectedRoute,deleteFireClaimNotification);
module.exports = router;
