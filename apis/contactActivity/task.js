const express = require("express");
const router = express.Router();
const accessRight = require("../middlewares/authorization");
const protectedRoute = require("../middlewares/protectedRoute");
const {
  getTask,
  getTodayTasks,
  createTask,
  getTaskByPk,
  editTask,
  deleteTask,
  getTaskByContact,
  getTaskByUser,
  getTaskByEmployee,
  addEmployee,
} = require("../handlers/contactActivity/TaskHandler");


router.route("/").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getTask);
router.route("/today").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getTodayTasks);
router.route("/:id").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getTaskByPk);
router.route("/getUserTask/:id").get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getTaskByUser);
router
  .route("/getContactTask/:target/:id")
  .get(protectedRoute, accessRight.canUserRead(["leads", "accounts", "opportunitys"]), getTaskByContact);
router.route("/").post(protectedRoute, accessRight.canUserCreate(["leads", "accounts", "opportunitys"]), createTask);
//router.route("/").post(protectedRoute, accessRight.canUserCreate(["leads", "accounts", "opportunitys"]), createTask);
router.route("/").put(protectedRoute, accessRight.canUserEdit(["leads", "accounts", "opportunitys"]), editTask);
router.route("/:id").delete(protectedRoute, accessRight.canUserDelete(["leads", "accounts", "opportunitys"]), deleteTask);

module.exports = router;
