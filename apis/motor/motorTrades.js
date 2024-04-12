const express = require("express");
const router = express.Router();
const {getMotorTrade, getAllMotorTrades, createMotorTrade, createMotorTrades, getMotorTradeByPk , editMotorTrade, deleteMotorTrade,getMotorTradeByName} = require("../handlers/motor/MotorTradesHandler");
const protectedRoute = require("../middlewares/protectedRoute");

router.route("/").get(protectedRoute, getMotorTrade);
router.route("/all").get(protectedRoute, getAllMotorTrades);
router.route("/type/:type").get(protectedRoute, getMotorTradeByName);

router.route("/:id").get(protectedRoute, getMotorTradeByPk);
router.route("/").post(protectedRoute, createMotorTrade);
router.route("/multiple").post(protectedRoute, createMotorTrades);
router.route("/:id").put(protectedRoute, editMotorTrade);
router.route("/:id").delete(protectedRoute, deleteMotorTrade);
``
module.exports = router;
