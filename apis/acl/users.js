const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  getUserForPick,
  storeUser,
  getSearchResults,
  getUser,
  getUsersForSharing,
  editUser,
  changePassword,
  // deleteUser,
  signup,
  accessControlLists,
  toggleActivation,
  getCustomerUsers,
  createSystemUser,
  firstActivate,
  assignRole,
  signupCustomer,
  createUserFromContact,
} = require("../handlers/acl/UserHandler");
const accessRight = require("../middlewares/authorization");
const userAccess = require("../middlewares/createUser");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../uploads/employees/profile_pic"));
  },
  filename: (req, file, cb) => {
    
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage }).single("profile_picture");

const protectedRoute = require("../middlewares/protectedRoute");
router.route("/signup/customer").post(signupCustomer);

const validateToken = require("../middlewares/validateToken");
const { canUserEdit } = require("../../utils/Authrizations");

router.route("/forPick").get(getUserForPick);
router.route("/customers").get(protectedRoute, getCustomerUsers);
router.route("/:showMode").get(getUsers);
router.route("/get/:id").get(protectedRoute, getUser);
router.route("/search/:key").get(protectedRoute, getSearchResults);
router.route("/toggleActivation/:id").get(protectedRoute, toggleActivation);
router
  .route("/set_authorizations/:newPath")
  .get(protectedRoute, accessControlLists);

router.route("/").post(signup); // anyone can access it
router.route("/assignRole").post(protectedRoute, assignRole); // 
router.route("/customer/createUser").post(protectedRoute, accessRight.canUserCreate(["employees", "accounts", "agents", "organizations"]), createUserFromContact);
router.route("/createUser").post(protectedRoute, accessRight.canUserCreate(["employees", "accounts", "agents", "organizations"]), createSystemUser);

router.route("/firstActivate").post(firstActivate); // anyone can access it
router.route("/get_info").post(protectedRoute, storeUser); //handled by matching user id with token user id
router.route("/filterUser").post(getUsersForSharing); // handled by allowing only staff and superadmin

router.route("/validate_token").post(validateToken); // anyone can access it

router.route("/:id").put(protectedRoute, upload, editUser); // handled by matching incoming id with token user id
router.route("/password/:id").put(protectedRoute, changePassword); // handled my fetching user from token user email

// router.route("/:id").delete(protectedRoute, deleteUser);
module.exports = router;
