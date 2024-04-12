const express = require("express");
const router = express.Router();
const { getPhoneNos, createPhoneNo, getPhoneNo, editPhoneNo, deletePhoneNo, getAllPhoneNos, getPhoneNoByShareHolder, addShareHolderPhone, getPhoneNoByBranch,
addBranchPhone} = require("./handlers/PhoneNoHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getPhoneNos); 
router.route("/all/").get(protectedRoute, getAllPhoneNos);
router.route("/:id").get(protectedRoute, getPhoneNo);
router.route("/shareHolders/:id").get(protectedRoute, getPhoneNoByShareHolder);
router.route("/branch/:id").get(protectedRoute, getPhoneNoByBranch);
router.route("/addShareHolderPhone").post(protectedRoute, addShareHolderPhone);
router.route("/addBranchPhone").post(protectedRoute,addBranchPhone);
router.route("/").post(protectedRoute,createPhoneNo);
router.route("/:id").put(protectedRoute, editPhoneNo);
router.route("/:id").delete(protectedRoute, deletePhoneNo);
module.exports = router;