const express = require("express") ;
const router = express.Router() ; // express ka router create kiya gaya hai taki routes ko define kiya ja sake
const authController = require("../controller/auth.controller") ; // auth.controller.js file me registerUser function ko import kiya gaya hai taki user registration ke liye use kiya ja sake

// ==================== USER ROUTES ====================

router.post("/user/register" , authController.registerUser) ;
router.post("/user/login" , authController.loginUser) ;
router.get("/user/logout" , authController.logoutUser);

// ==================== FOOD PARTNER ROUTES ====================

router.post("/food-partner/register" , authController.registerFoodPartner) ;
router.post("/food-partner/login" , authController.loginFoodPartner) ;
router.get("/food-partner/logout" , authController.logoutFoodPartner) ;

module.exports = router ; // router ko export kiya gaya hai taki dusre files me use kiya ja sake