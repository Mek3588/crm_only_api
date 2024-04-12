const express = require("express");
const router = express.Router();
const {
  getContacts,
  getMemberOfC,
  getLeads,
  getContactsByEmployeeAndStatus,
  createContact,
  createContacts,
  getContact,
  editContact,
  deleteContact,
  getSearchResults,
  editProspective,
  editOpportunity,
  generateReport,
  restoreContacts,
  convertLead,
  getEmail,
  getSMS,
  sendContactSMS,
  sendEmail,
  exportContacts,
  getContactByProposal,
  getContactByInvoice,
  fetchDeletedContacts,
  getDeletedContacts,
  getCampaignContacts,
} = require("./handlers/ContactsHandler");
const emailUpload = require("../utils/fileUpload").array("uploads");
const accessRight = require("./middlewares/authorization");
const protectedRoute = require("./middlewares/protectedRoute");


router.route("/search").get(protectedRoute,getSearchResults);
router.route("/export").get(protectedRoute, exportContacts);
// router.route("/prospects").get(protectedRoute, getProspects);
// router.route("/opportunities").get(protectedRoute, getOpportunities);
router.route("/sms/:id").get(protectedRoute, getSMS);
router.route("/email/:id").get(protectedRoute,accessRight.canUserRead(["accounts","leads"]), getEmail);
router.route("/leads").get(protectedRoute, getLeads);
router.route("/").get(protectedRoute, getContacts);
router.route("/pickMemberOf").get(protectedRoute, getMemberOfC);
router
  .route("/type/status")
  .get(protectedRoute, getContactsByEmployeeAndStatus);
router.route("/convert/:id").put(protectedRoute,accessRight.canUserEdit(["leads"]), convertLead);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["accounts","leads"]), getContact);
router.route("/proposal/:id").get(protectedRoute, accessRight.canUserRead(["proposals"]), getContactByProposal);
router.route("/invoice/:id").get(protectedRoute, accessRight.canUserRead(["invoices"]), getContactByInvoice);

router.route("/:stage").get(protectedRoute,accessRight.canUserRead(["accounts","leads"]), getContacts);
router.route("/restore/:id").get(protectedRoute,accessRight.canUserRead(["accounts","leads"]), getDeletedContacts);
router.route("/restore").post(protectedRoute,accessRight.canUserCreate(["accounts","leads"]), restoreContacts);
router.route("/").post(protectedRoute, createContact);
router.route("/email").post(protectedRoute,accessRight.canUserEdit(["accounts","leads"]), emailUpload, sendEmail);
router.route("/sms").post(protectedRoute,accessRight.canUserEdit(["accounts","leads"]), sendContactSMS);

router.route("/report/:status").post(protectedRoute, generateReport);
router.route("/multiple/:status").post(protectedRoute,accessRight.canUserCreate(["contacts"]), createContacts);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["accounts","leads"]), editContact);

router.route("/prospects/:id").put(protectedRoute,editProspective);
router.route("/opportunities/:id").put(protectedRoute, editOpportunity);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["accounts","leads"]), deleteContact);
router.route("/campaign/:id").get(getCampaignContacts);

module.exports = router;
