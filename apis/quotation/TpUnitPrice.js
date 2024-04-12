const express = require("express");
const { getTpUnitPrice, getTpUnitPriceByPk, createTpUnitPrice, editTpUnitPrice, deleteTpUnitPrice } = require("../handlers/quotation/TpUnitPriceHandler");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["tpUnitPrices"]), getTpUnitPrice);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["tpUnitPrices"]), getTpUnitPriceByPk);

router.route("/").post(protectedRoute,accessRight.canUserCreate(["tpUnitPrices"]), createTpUnitPrice);


router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["tpUnitPrices"]), editTpUnitPrice);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["tpUnitPrices"]), deleteTpUnitPrice);
module.exports = router;