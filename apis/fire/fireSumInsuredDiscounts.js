const express = require("express");
const router = express.Router();
const {
  getFireSumInsuredDiscount,
  getAllFireSumInsuredDiscounts,
  createFireSumInsuredDiscount,
  createFireSumInsuredDiscounts,
  getFireSumInsuredDiscountByPk,
  editFireSumInsuredDiscount,
  deleteFireSumInsuredDiscount,
} = require("../handlers/fire/FireSumInsuredDiscountsHandler");
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

//routes

router.route("/").get(protectedRoute, accessRight.canUserRead(["fireSumInsuredDiscounts"]), getFireSumInsuredDiscount);
router.route("/all").get(protectedRoute, getAllFireSumInsuredDiscounts);
router.route("/:id").get(protectedRoute, getFireSumInsuredDiscountByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["fireSumInsuredDiscounts"]), createFireSumInsuredDiscount);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["fireSumInsuredDiscounts"]), createFireSumInsuredDiscounts);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["fireSumInsuredDiscounts"]), editFireSumInsuredDiscount);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["fireSumInsuredDiscounts"]), deleteFireSumInsuredDiscount);
``;
module.exports = router;
