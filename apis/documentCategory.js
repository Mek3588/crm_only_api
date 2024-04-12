const express = require("express");
const router = express.Router();
const {
  getAllCategory,
  createCategory,
  createCategories,
  getCategoryByPk,
  editCategory,
  deleteCategory,
  getAllCategories,
} = require("./handlers/DocumentCategoryHandler");
const protectedRoute = require("./middlewares/protectedRoute");
const accessRight = require("./middlewares/authorization");
//  accessRight.canUserRead("documentCategory");

router.route("/getAll").get(protectedRoute, getAllCategories);
router
  .route("/:id")
  .get(
    protectedRoute,
    accessRight.canUserRead("documentCategory"),
    getCategoryByPk
  );
router
  .route("/")
  .get(
    protectedRoute,
    accessRight.canUserRead("documentCategory"),
    getAllCategory
  );
router
  .route("/")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["documentCategory"]),
    createCategory
  );
router
  .route("/multiple")
  .post(
    protectedRoute,
    accessRight.canUserCreate(["documentCategory"]),
    createCategories
  );
router
  .route("/")
  .put(
    protectedRoute,
    accessRight.canUserEdit("documentCategory"),
    editCategory
  );
router
  .route("/:id")
  .delete(
    protectedRoute,
    accessRight.canUserDelete("documentCategory"),
    deleteCategory
  );

module.exports = router;
