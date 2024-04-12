const express = require("express");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const {
  getNote,
  createNote,
  getNoteByPk,
  editNote,
  deleteNote,
  getNoteByUser,
  getNoteByCustomer,
  addEmployee,
  getNoteByEmployee,
} = require("../handlers/CustomerHandler/CustomerNotesHandler");

/**
 * Customer note routes
 */
router.route("/").get(protectedRoute, getNote);
router.route("/:id").get(protectedRoute, getNoteByPk);
router.route("/getUserNote/:id").get(protectedRoute, getNoteByUser);
router
  .route("/getContactNote/:target/:id")
  .get(protectedRoute, getNoteByCustomer);
router.route("/").post(protectedRoute, createNote);
router.route("/").put(protectedRoute, editNote);
router.route("/:id").delete(protectedRoute, deleteNote);
router.route("/getByEployee/:id").get(protectedRoute, getNoteByEmployee);
router.route("/addEmployee").put(protectedRoute, addEmployee);
module.exports = router;
