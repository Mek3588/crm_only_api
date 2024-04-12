const express = require("express");
const router = express.Router();
const {getCertificates, createCertificate, getCertificate , editCertificate, deleteCertificate} = require("./handlers/CertificatesHandler");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getCertificates);
router.route("/:id").get(protectedRoute, getCertificate);
router.route("/").post(protectedRoute, createCertificate);
router.route("/:id").put(protectedRoute, editCertificate);
router.route("/:id").delete(protectedRoute, deleteCertificate);
module.exports = router;