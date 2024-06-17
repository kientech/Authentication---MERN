import { Router } from "express";
import * as controller from "../controllers/appController.js";
import Auth, { localVariables } from "../middleware/auth.js";
import { registerMail } from "../middleware/mailer.js";

const router = Router();

// POST Methods
router.route("/register").post(controller.register);

router.route("/registerMail").post(registerMail); // send the email
router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) => res.end()); // authenticate the user
router.route("/login").post(controller.verifyUser, controller.login); //login the app

// GET Methods
router.route("/user/:username").get(controller.getUser); // user with username
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP); //verify generated OTP
router.route("/createResetSession").get(controller.createResetSession); // reset all the variables

// PATCH Methods
router.route("/updateUser").patch(Auth, controller.updateUser); // update user profile
router
  .route("/resetPassword")
  .patch(controller.verifyUser, controller.resetPassword); // use to reset password

export default router;
