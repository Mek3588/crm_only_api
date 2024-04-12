const express = require("express");
const router = express.Router();
const {getFireApplicableWarranty, getAllFireApplicableWarrantys, createFireApplicableWarranty, createFireApplicableWarrantys, getFireApplicableWarrantyByPk , editFireApplicableWarranty, deleteFireApplicableWarranty} = require("../handlers/fire/FireApplicableWarrantysHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["fireApplicableWarrantys"]), getFireApplicableWarranty);
router.route("/all").get(protectedRoute, getAllFireApplicableWarrantys);
router.route("/:id").get(protectedRoute, getFireApplicableWarrantyByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["fireApplicableWarrantys"]),createFireApplicableWarranty);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["fireApplicableWarrantys"]), createFireApplicableWarrantys);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["fireApplicableWarrantys"]), editFireApplicableWarranty);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["fireApplicableWarrantys"]), deleteFireApplicableWarranty);
``
module.exports = router;
 