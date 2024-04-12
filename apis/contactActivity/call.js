const express = require("express");
const router = express.Router();
const accessRight = require("../middlewares/authorization");
const { getCall, createCall, getCallByPk, editCall, deleteCall, getCallByContact } = require("../handlers/contactActivity/CallHandler");
const protectedRoute = require("../middlewares/protectedRoute");

router.route("/").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getCall);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getCallByPk);
router.route("/getContactCall/:target/:id").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getCallByContact);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["leads", "accounts", "opportunitys"]), createCall);
router.route("/").put(protectedRoute, accessRight.canUserEdit(["leads", "accounts", "opportunitys"]), editCall);
router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["leads", "accounts", "opportunitys"]), deleteCall);
module.exports = router;

