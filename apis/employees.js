const express = require("express");
const router = express.Router();
const { getEmployees, createEmployee, getEmployee, editEmployee, deleteEmployee, getActiveEmployees, employeeByGroup, getEmployeebyContact,
  getSearchResults, createEmployees, filterEmployee, getBranchEmployee, generateReport, getEmail,getSMS,sendEmail,sendSMS, getAllEmployees, getEmployeesbyBranch,toggleActivation} = require("./handlers/EmployeesHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({ 
  destination:(req,file,cb)=>{
    cb(null,path.join(__dirname,'../uploads/employees/profile_pic'))
  },
  filename:(req,file,cb) =>{
    
    
    cb(null,Date.now() + path.extname(file.originalname))
  }
})

const upload= multer({storage:storage}).single('profile_picture') 
const emailUpload = require('../utils/fileUpload').array('uploads') 
const accessRight = require("./middlewares/authorization")
//not all done
router.route("/").get(protectedRoute, getEmployees);
router.route("/branchEmployees").get(protectedRoute, getBranchEmployee);
router.route("/branchId/:id").get(protectedRoute, getEmployeesbyBranch);
router.route("/activeEmployees").get(protectedRoute, getActiveEmployees);
router.route("/group/:id").get(protectedRoute, employeeByGroup);
router.route("/sms/:id").get(protectedRoute, getSMS);
router.route("/email/:id").get(protectedRoute, getEmail);
router.route("/all").get(protectedRoute, getAllEmployees);
router.route("/toggleActivation/:userId").get(protectedRoute, toggleActivation);
router.route("/report").post(protectedRoute,generateReport);
router.route("/search/all").get(filterEmployee); 
router.route("/search/:key").get(getSearchResults);
router.route("/").get(protectedRoute,accessRight.canUserRead(["employees"]), getEmployees);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["employees"]),getEmployee);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["employees"]), upload, createEmployee);
router.route("/email").post(protectedRoute,emailUpload, sendEmail);
router.route("/sms").post(protectedRoute, sendSMS);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["employees"]),createEmployees);
router.route("/:id").put(protectedRoute, upload, editEmployee);
router.route("/:id").delete(protectedRoute, deleteEmployee);  
router.route("/contact/:id").get(protectedRoute, getEmployeebyContact); 
router.route("/contact/:id").get(protectedRoute, getEmployeebyContact); 




module.exports = router;