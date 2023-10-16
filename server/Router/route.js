import { Router } from "express";
const router = Router();

/**import all controllers */
import * as controller from '../Controllers/appController.js'
import { registerMail } from "../Controllers/mailer.js";
import authMiddleware,{localVariables} from '../middleware/auth.js'



/**POST Methods */
router.route('/register').post(controller.register); //register user
router.route('/registerMail').post(registerMail); //send the email
router.route('/authenticate').post(controller.verifyUser,(req,res)=>res.end()); //login in app
router.route('/login').post(controller.verifyUser,controller.login);

/**GET Methods */
router.route('/user/:username').get(controller.getUser); //user with username
router.route('/generateOTP').get(controller.verifyUser,localVariables,controller.generateOTP); //generate random OTP
router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP);//verify generated OTP
router.route('/createResetSession').get(controller.createResetSession);//reset all the variables

/**PUT Methods */
router.route('/updateUser').put(authMiddleware,controller.updateUser);//update the user profile
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword);//to reset password


export default router;