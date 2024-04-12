const express = require("express");
const router = express.Router();
const { getCsrf, validateCSRF } = require("./handlers/Csrf");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(validateCSRF);

module.exports = router;
