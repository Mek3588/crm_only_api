const express = require("express");

const { getFinance, getFinanceByPk, editFinance, approveFinance } = require("./handlers/ReceiptOrderHandler");

const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");


router.route("/").get(protectedRoute, accessRight.canUserRead(["financeOrders"]), getFinance);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["financeOrders"]), getFinanceByPk);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["bsgs"]), editFinance);



// CAUTION protected route must be included for finance approval.
router.route("/approveFinance/:id").put(
    // protectedRoute, 
    approveFinance);


module.exports = router;
