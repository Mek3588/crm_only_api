const express = require("express");
const router = express.Router();
const {getTemporaryNotice,
    createTemporaryNotice,
    getTemporaryNoticeByPk,
    editTemporaryNotice,
    deleteTemporaryNotice} = require("./handlers/claim/TemporaryNoticeHandler");
const protectedRoute = require("./middlewares/protectedRoute");



router.route("/").get(protectedRoute,getTemporaryNotice);
router.route("/:id").get(protectedRoute,getTemporaryNoticeByPk);
router.route("/").post(protectedRoute, createTemporaryNotice);
router.route("/:id").put(protectedRoute,editTemporaryNotice);
router.route("/:id").delete(protectedRoute,deleteTemporaryNotice);
module.exports = router;