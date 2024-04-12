const express = require("express");
const router = express.Router();
const protectedRoute = require("./middlewares/protectedRoute");
const {
  getMultipleProposal,
  getMultipleProposalByPk,
  createMultipleProposal,
  editMultipleProposal,
  deleteMultipleProposal,
} = require("./handlers/MultipleProposalHandler");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute,accessRight.canUserRead(["multipleProposals"]), getMultipleProposal);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["multipleProposals"]), getMultipleProposalByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["multipleProposals"]), createMultipleProposal);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["multipleProposals"]), editMultipleProposal);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["multipleProposals"]), deleteMultipleProposal);

module.exports = router;
