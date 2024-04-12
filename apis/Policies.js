const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const {
  getPolicy,
  getPolicyByPk,
  createPolicy,
  editPolicy,
  PolicyPayed,
  deletePolicy,
  getPolicyByContactId,
  getMultiplePolicy,
} = require("./handlers/PolicyHandler");
const accessRight = require("./middlewares/authorization");

router.route("/multiple").get(protectedRoute,accessRight.canUserRead(["policies_draft", "policies_final"]), getMultiplePolicy);
router.route("/pay").put(protectedRoute, accessRight.canUserEdit(["policies_draft", "policies_final"]), PolicyPayed);
router.route("/").get(protectedRoute, accessRight.canUserRead(["policies_draft", "policies_final"]), getPolicy);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["policies_draft", "policies_final"]), getPolicyByPk);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["policies_draft", "policies_final"]), createPolicy);
router.route("/:id").put(protectedRoute, accessRight.canUserEdit(["policies_draft", "policies_final"]), editPolicy);
router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["policies_draft", "policies_final"]), deletePolicy);
router.route("/contact/:id").get(protectedRoute, accessRight.canUserRead(["policies_draft", "policies_final"]), getPolicyByContactId);


module.exports = router;
