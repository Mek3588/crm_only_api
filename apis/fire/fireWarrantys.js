const express = require("express");
const router = express.Router();
const {getFireWarranty, getAllFireWarrantys, createFireWarranty, createFireWarrantys, getFireWarrantyByPk , editFireWarranty, deleteFireWarranty} = require("../handlers/fire/FireWarrantyHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["fireWarranty"]), getFireWarranty);
router.route("/all").get(protectedRoute, getAllFireWarrantys);
router.route("/:id").get(protectedRoute, getFireWarrantyByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["fireApplicableWarrantys"]), createFireWarranty);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["fireApplicableWarrantys"]), createFireWarrantys);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["fireApplicableWarrantys"]), editFireWarranty);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["fireApplicableWarrantys"]), deleteFireWarranty);
``
module.exports = router;
 