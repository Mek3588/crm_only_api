const express = require("express");
const router = express.Router();
const {getCustomerProductCategory, getAllCustomerProductCategorys, createCustomerProductCategory, createCustomerProductCategorys, getCustomerProductCategoryByPk , editCustomerProductCategory, deleteCustomerProductCategory,getCustomerProductCategoryByName} = require("./handlers/CustomerProductCategorysHandler");
const accessRight = require("./middlewares/authorization");
const protectedRoute = require("./middlewares/protectedRoute");

router.route("/").get(protectedRoute, getCustomerProductCategory);
router.route("/all").get(protectedRoute, getAllCustomerProductCategorys);
router.route("/name/:name").get(protectedRoute, getCustomerProductCategoryByName);

router.route("/:id").get(protectedRoute, getCustomerProductCategoryByPk);
router.route("/").post(protectedRoute,accessRight.canUserCreate(["customerProductCategorys"]), createCustomerProductCategory);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["customerProductCategorys"]), createCustomerProductCategorys);
router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["customerProductCategorys"]), editCustomerProductCategory);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["customerProductCategorys"]), deleteCustomerProductCategory);
``
module.exports = router;
