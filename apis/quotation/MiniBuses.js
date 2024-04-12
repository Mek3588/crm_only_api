const express = require("express");
const{getMiniBus, getMiniBusByPk, createMiniBus, editMiniBus, deleteMiniBus, createMiniBuses} = require("../handlers/quotation/MiniBusHandler");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");


router.route("/").get(protectedRoute,accessRight.canUserRead(["buses"]), getMiniBus);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["buses"]), getMiniBusByPk);

router.route("/").post(protectedRoute,accessRight.canUserCreate(["buses"]), createMiniBus);


router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["buses"]), editMiniBus);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["buses"]), deleteMiniBus);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["vehicleRateCharts"]), createMiniBuses);
module.exports = router;