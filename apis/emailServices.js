const express = require("express");
const router = express.Router();
const {sendEmail, sendEmails} = require("./handlers/EmailServiceHandler.js");
const protectedRoute = require("./middlewares/protectedRoute");
const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({ 
  destination:(req,file,cb)=>{
    cb(null, path.join(__dirname, '../uploads'))
   
  },
  filename:(req,file,cb) =>{
    
    cb(null,Date.now() + path.extname(file.originalname))
  }
})
const upload= multer({storage:storage})

router.route("/").post(protectedRoute, upload.array('file'), sendEmail);
router.route("/multiple").post(protectedRoute, upload.array('file'), sendEmails);

module.exports = router;