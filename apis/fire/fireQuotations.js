const express = require("express");
const router = express.Router();
const {
    getFireQuotation, 
    createFireQuotation, 
    getFireQuotationByPk,
    getFireQuotationsByGroup, 
    editFireQuotation, 
    deleteFireQuotation, 
    getAllFireQuotations, 
    getNotifications, 
    createFireQuotations, 
    notifyBranchManager,
    generateReport,
    getAllFireQuotationsReport} = require("../handlers/fire/FireQuotationsHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");



router.get("/firegroup", protectedRoute, accessRight.canUserRead(["fireQuotationsRequest"]), getFireQuotationsByGroup);
router.route("/").get(protectedRoute, accessRight.canUserRead(["fireQuotationsRequest"]), getFireQuotation);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["fireQuotationsRequest"]), getFireQuotationByPk);
router.route('/all').get(protectedRoute,accessRight.canUserRead(["fireQuotationsRequest"]), getAllFireQuotations);
router.route('/notifications/:id').get(protectedRoute, accessRight.canUserRead(["fireQuotationsRequest","fireQuotations"]), getNotifications);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["fireQuotationsRequest"]), createFireQuotation);
router.route("/multiple").post(protectedRoute, accessRight.canUserCreate(["fireQuotationsRequest"]), createFireQuotations);
router.route("/:id").put(protectedRoute, accessRight.canUserEdit(["fireQuotationsRequest"]), editFireQuotation);
router.route("/negotiate/:id").put(protectedRoute, accessRight.canUserEdit(["fireQuotationsRequest"]), notifyBranchManager);
router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["fireQuotationsRequest", "fireQuotations"]), deleteFireQuotation);
router.route("/report").post(protectedRoute, accessRight.canUserCreate(["fireQuotations"]), generateReport);
router.route("/report/all").get(protectedRoute, accessRight.canUserCreate(["fireQuotations"]), getAllFireQuotationsReport);

module.exports = router;