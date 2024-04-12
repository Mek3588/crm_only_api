const express = require("express");
const router = express.Router();
const protectedRoute = require("../middlewares/protectedRoute");
const accessRight = require("../middlewares/authorization");

const {
  getNote,
  createNote,
  getNoteByPk,
  editNote,
  deleteNote,
  getNoteByUser,
  getNoteByContact,
  addEmployee,
  getNoteByEmployee,
} = require("../handlers/contactActivity/NoteHandler");
router.route("/").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getNote);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getNoteByPk);
router.route("/getUserNote/:id").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getNoteByUser);
router
  .route("/getContactNote/:target/:id")
  .get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getNoteByContact);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["leads", "accounts", "opportunitys"]), createNote);
router.route("/").put(protectedRoute, accessRight.canUserEdit(["leads", "accounts", "opportunitys"]), editNote);
router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["leads", "accounts", "opportunitys"]), deleteNote);
router.route("/getByEployee/:id").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getNoteByEmployee);
router.route("/addEmployee").put(protectedRoute, accessRight.canUserEdit(["leads", "accounts", "opportunitys"]), addEmployee);
module.exports = router;
