const express = require("express");
const router = express.Router();
const {getDepartment,getDepartmentPopUp, createDepartment, getDepartmentByPk , editDepartment, deleteDepartment, createDepartments, getAllDepartments, handleDepartmentActivation} = require("./handlers/DepartmentHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");

router.route("/").get(protectedRoute,accessRight.canUserRead(["departments"]), getDepartment);
router.route("/popUp").get(protectedRoute,accessRight.canUserRead(["departments","competitors","partners","shareholders","vendors","employees"]), getDepartmentPopUp);
router.route("/all").get(protectedRoute,accessRight.canUserRead(["departments"]), getAllDepartments);
router.route("/:id").get(protectedRoute,accessRight.canUserRead(["departments"]), getDepartmentByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["departments"]), createDepartment);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["departments"]), createDepartments);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["departments"]), editDepartment);
router.route("/activation/:id").get(protectedRoute, handleDepartmentActivation);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["departments"]), deleteDepartment);

module.exports = router;
