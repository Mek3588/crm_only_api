const express = require("express");
const router = express.Router();
const { getDocument, createDocument, getDocumentByPk, editDocument, deleteDocument, getDocumentByVendor,
    createDocumentVendor, getDocumentByShareholder, createDocumentShareholder,
    getDocumentByCompetitor,
 getDocumentByPartner,
  createDocumentPartner,
  createDocumentCompetitor,
  getDocumentByAgent,
  createDocumentAgent,
  getDocumentByOrganization,
  createDocumentOrganization,
  createDocumentContact,
  getDocumentByLead,
  getDocumentByAccount,
  getEmployeeDocuments,
  createEmployeeDocument,
  getActiveDocument,
  getDocumentByCustomer,
  createDocumentCustomer
} = require("./handlers/DocumentHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const multer = require("multer");
const path = require('path')
const upload = require('./../utils/fileUpload').single('document') 

router.route("/active").get(protectedRoute, getActiveDocument);

router.route("/").get(protectedRoute, getDocument);
router.route("/:id").get(protectedRoute, getDocumentByPk);
router.route("/vendor/:id").get(protectedRoute, getDocumentByVendor);
router.route('/employees/:id').get(protectedRoute, getEmployeeDocuments);
router.route("/shareholder/:id").get(protectedRoute, getDocumentByShareholder);
router.route("/competitor/:id").get(protectedRoute, getDocumentByCompetitor);
router.route("/partner/:id").get(protectedRoute, getDocumentByPartner);
router.route("/agent/:id").get(protectedRoute, getDocumentByAgent);
router.route("/organization/:id").get(protectedRoute, getDocumentByOrganization);  
router.route("/vendor").post(protectedRoute, upload, createDocumentVendor);
router.route("/contact").post(protectedRoute, upload, createDocumentContact);
router.route("/lead/:id").get(protectedRoute, upload, getDocumentByLead);
router.route("/account/:id").get(protectedRoute, upload, getDocumentByAccount);
router.route("/customers/:id").get(protectedRoute, upload, getDocumentByCustomer);
router
  .route("/customers")
  .post(protectedRoute, upload, createDocumentCustomer);

router.route("/shareholder").post(protectedRoute, upload, createDocumentShareholder);
router.route("/partner").post(protectedRoute, upload, createDocumentPartner);
router.route("/agent").post(protectedRoute, upload, createDocumentAgent);
router.route('/employees').post(protectedRoute, upload, createEmployeeDocument)
router.route("/organization").post(protectedRoute, upload, createDocumentOrganization);
router.route("/competitor").post(protectedRoute, upload, createDocumentCompetitor);
router.route("/").post(protectedRoute, upload, createDocument);
router.route("/:id").put(protectedRoute, upload,editDocument);
router.route("/:id").delete(protectedRoute, deleteDocument);
module.exports = router;