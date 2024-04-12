const express = require("express");
const router = express.Router();
const {
  getInvoice,
  createInvoice,
  getInvoiceByPk,
  editInvoice,
  deleteInvoice,
  createInvoices,
  getAllInvoices,
} = require("./handlers/InvoiceHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute, accessRight.canUserRead(["invoices"]), getInvoice);
router.route("/all").get(protectedRoute, accessRight.canUserRead(["invoices"]), getAllInvoices);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["invoices"]), getInvoiceByPk);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["invoices"]), createInvoice);
router.route("/multiple").post(protectedRoute, accessRight.canUserCreate(["invoices"]), createInvoices);

router.route("/:id").put(protectedRoute, accessRight.canUserEdit(["invoices"]), editInvoice);
router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["invoices"]), deleteInvoice);
``;
module.exports = router;
