const { getNumberOfAccount } = require("../handlers/dashboard/AccountReport");
const protectedRoute = require("../middlewares/protectedRoute");

const router = require("express").Router();

router.route("/numberOfAccount").get(protectedRoute, getNumberOfAccount);

module.exports = router;