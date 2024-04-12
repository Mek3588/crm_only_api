const express = require("express");
const router = express.Router();
const {
  getCustomerProduct,
  createCustomerProduct,
  getCustomerProductByPk,
  editCustomerProduct,
  deleteCustomerProduct,
  createCustomerProducts,
  getCustomerProductsByCustomerProductCategory,
  getCustomerProductsByCountries,
  getAllCustomerProducts,
} = require("./handlers/CustomerProductsHandler");
const multer = require("multer");
const path = require('path')

const storage = multer.diskStorage({ 
  destination:(req,file,cb)=>{
    cb(null,path.join(__dirname,'../uploads'))
  },
  filename:(req,file,cb) =>{
    
    
    cb(null,Date.now() + path.extname(file.originalname))
  }
})

const upload= multer({storage:storage}).single('productImage') 
const accessRight = require("./middlewares/authorization");
const protectedRoute = require("./middlewares/protectedRoute");


/**
 * CustomerProduct routes
 */
router.route("/").get(protectedRoute, getCustomerProduct);
router.route("/all").get(protectedRoute, getAllCustomerProducts);
router.route("/:id").get(protectedRoute, getCustomerProductByPk);
router.route("/categorys/:name").get(protectedRoute, getCustomerProductsByCustomerProductCategory);
router.route("/categorys").post(protectedRoute, getCustomerProductsByCountries);
router.route("/").post(protectedRoute, upload,accessRight.canUserCreate(["customerProducts"]),createCustomerProduct);
router.route("/multiple").post(protectedRoute,accessRight.canUserCreate(["customerProducts"]), createCustomerProducts);

router.route("/:id").put(protectedRoute,accessRight.canUserEdit(["customerProducts"]), upload, editCustomerProduct);
router.route("/:id").delete(protectedRoute,accessRight.canUserDelete(["customerProducts"]), deleteCustomerProduct);
module.exports = router;
