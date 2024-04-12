const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getting,
  forgotPassword,
  resetPassword,
  confirmSMS,
} = require("./handlers/acl/UserHandler");
router.use(express.json());
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User signup
 *     description: Creates a new user account.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User signup details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *             corporate_name:
 *               type: string
 *             first_name:
 *               type: string
 *             middle_name:
 *               type: string
 *             last_name:
 *               type: string
 *             email:
 *               type: string
 *             gender:
 *               type: string
 *             phone:
 *               type: string
 *             password:
 *               type: string
 *             role:
 *               type: string
 *             activated:
 *               type: boolean
 *             confirm_password:
 *               type: string
 *             branchId:
 *               type: number
 *             business_source_type:
 *               type: string
 *             business_source:
 *               type: string
 *     responses:
 *       '200':
 *         description: User signed up successfully
 *         schema:
 *           type: object
 *           properties:
 *             userToken:
 *               type: string
 *       '400':
 *         description: Bad request. Invalid or missing parameters
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       '404':
 *         description: Error occurred while signing up
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 */

// router.get("/signup", (req, res) => {
//   res.json({ msg: "regstration works" });
// });
//
router.route("/signup").post(signup);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user with provided credentials.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User login details
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         schema:
 *           type: object
 *           properties:
 *             userToken:
 *               type: string
 *       '400':
 *         description: Bad request. Invalid or missing parameters
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       '404':
 *         description: User not found or incorrect credentials
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       '500':
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 */

router.route("/login").post(login);
/**
 * @swagger
 * /auth/forgot_password:
 *   post:
 *     summary: Forgot password
 *     description: Sends a short code to the user's phone for password reset.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User phone number
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *     responses:
 *       '200':
 *         description: Short code sent successfully
 *         schema:
 *           type: object
 *           properties:
 *             // Define the properties returned in the response, if any
 *       '404':
 *         description: User not found or phone not registered
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       '500':
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 */

router.route("/forgot_password").post(forgotPassword);
/**
 * @swagger
 * /auth/confirm_sms:
 *   post:
 *     summary: Confirm SMS
 *     description: Verifies the confirmation SMS code sent to the user's phone.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User phone number and confirmation SMS code
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *             confirmationSMS:
 *               type: string
 *     responses:
 *       '200':
 *         description: SMS code confirmed successfully
 *         schema:
 *           type: object
 *           properties:
 *             confirmationSMS:
 *               type: string
 *             id:
 *               type: string
 *       '400':
 *         description: Incorrect credentials or SMS code
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       '404':
 *         description: User not found or incorrect credentials
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       '500':
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 */

router.route("/confirm_sms").post(confirmSMS);
/**
 * @swagger
 * /auth/reset_password:
 *   post:
 *     summary: Reset Password
 *     description: Resets the user's password using the confirmation SMS code.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User ID, new password, confirm password, and confirmation SMS code
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             password:
 *               type: string
 *             confirm_password:
 *               type: string
 *             shortCode:
 *               type: string
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       '400':
 *         description: Incorrect credentials or password confirmation mismatch
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       '404':
 *         description: User not found or incorrect credentials
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 *       '500':
 *         description: Internal server error
 *         schema:
 *           type: object
 *           properties:
 *             msg:
 *               type: string
 */

router.route("/reset_password").post(resetPassword);
module.exports = router;
