const { Router } = require('express');
const authController = require('../controllers/authController');

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
router.get('/welcome', authController.welcome_get);
router.post('/deleteuser', authController.deleteuser_get);
router.get('/accounthistory', authController.accounthistory_get);
router.get('/forgotpassword', authController.forgotpassword_get);
router.post('/forgotpassword', authController.forgotpassword_post);
router.get('/resetpassword/:token',authController.resetpassword_get);
router.post('/resetpassword',authController.resetpassword_post);


module.exports = router;