const express = require("express");
const router = express.Router();
const userController = require('../controller/user.controller')
const { isAuth } = require("../middleware/authenticate");

router.get('/getAllUser', userController.getAllUser);

router.post('/loginMobileOTP', userController.loginMobileOTP);

router.post('/mobileVerifyOTP', userController.mobileVerifyOTP);

router.post("/signup", userController.signUp)

router.post("/signin", userController.signIn);

router.post('/logoutuser', userController.logoutUser);

router.post('/forgetpasswordEmail', userController.forgetpasswordEmail);

router.post('/resetpasswordEmail/:token', userController.resetpasswordEmail);

router.post('/forgetpasswordMobile', userController.forgetpasswordMobile);

router.post('/chnagePassword', isAuth, userController.chnagePassword);

router.post('/loginEmailOTP', userController.loginEmailOTP);

router.post('/emailVerifyOTP', userController.emailVerifyOTP);

router.post('/sendWhatsapp',userController.sendWhatsAppMessage);


router.get('/1', userController.test1);





// /loginMobile
// /mobileVerifyOTP
// /signUp
// /signIn  Auth
// /logoutUser
// /forgetpasswordEmail
// /resetpasswordEmail/:token
// /forgetpasswordMobile
// /mobileVerifyOTP 
// /chnagePassword  isAuth

module.exports = router;