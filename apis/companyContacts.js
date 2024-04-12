const express = require("express");
const router = express.Router();
const {
  getCompanyContacts,
  createCompanyContact,
  getCompanyContact,
  editCompanyContact,
  deleteCompanyContact,
  generateReport,
  getSMS,
  getEmail,
  sendEmail,
  sendSMS,
  exportCompanyContacts,
  createCompanyContacts,
  updateContact,
} = require("./handlers/CompanyContactsHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const emailUpload = require("../utils/fileUpload").array("uploads");
router.route("/export").get(protectedRoute, exportCompanyContacts);
router.route("/sms/:id").get(protectedRoute, getSMS);
router.route("/email/:id").get(protectedRoute, getEmail);
router.route("/").get(protectedRoute, getCompanyContacts);
router.route("/multiple").post(protectedRoute, createCompanyContacts);
router.route("/report").post(protectedRoute, generateReport);
router.route("/email").post(protectedRoute, emailUpload, sendEmail);
router.route("/sms").post(protectedRoute, sendSMS);

router.route("/:id").get(protectedRoute, getCompanyContact);
router.route("/").post(protectedRoute, createCompanyContact);
router.route("/:id").put(protectedRoute, editCompanyContact);
router.route("/other/:id").put(protectedRoute, updateContact);

router.route("/:id").delete(protectedRoute, deleteCompanyContact);
module.exports = router;
