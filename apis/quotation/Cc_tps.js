const express = require("express");
const { getCCTP, getCCTPByPk, createCCTP, editCCTP, deleteCCTP } = require("../handlers/quotation/cc_tpHandler");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute,accessRight.canUserRead(["cc_tps"]), getCCTP);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["cc_tps"]), getCCTPByPk);

router.route("/").post(protectedRoute,accessRight.canUserCreate(["cc_tps"]), createCCTP);


router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["cc_tps"]), editCCTP);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["cc_tps"]), deleteCCTP);
module.exports = router;