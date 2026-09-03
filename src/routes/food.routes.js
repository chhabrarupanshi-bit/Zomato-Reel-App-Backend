const express = require("express") ;
const router = express.Router() ; // express ka router create kiya gaya hai taki routes ko define kiya ja sake
const authMiddlewares = require("../middlewares/auth.middleware") ; // auth.middleware.js file me verifyToken function ko import kiya gaya hai taki authentication ke liye use kiya ja sake
const foodController = require("../controller/food.controller") // food.controller.js file me createFood function ko import kiya gaya hai taki food collection ke liye schema define kiya ja sake
const multer = require("multer") // multer package ko import kiya gaya hai taki file upload ke liye use kiya ja sake

const upload = multer({ 
    storage : multer.memoryStorage()  // multer ka memoryStorage use kiya gaya hai taki file ko memory me store kiya ja sake   
})

// ==================== FOOD ROUTES ====================
/** /api/food  {protected verify}*/

// Route ka structure aisa hona chahiye:
router.post(
    "/",
    authMiddlewares.foodPartnerMiddleware,                  // 1. Auth check
    upload.single("vedios"),        // 2. Multer parse karega (Key name match hona chahiye)
    foodController.createFood       // 3. Controller run hoga
);

router.get('/get-items' , 
    authMiddlewares.authUserOrPartner , // 1. Auth check
    foodController.getFoodItems        // 2. Controller run hoga 
);

router.post('/like' , authMiddlewares.authUserMiddleware , foodController.likeFood) ; // 1. Auth check , 2. Controller run hoga

router.post('/save',
    authMiddlewares.authUserMiddleware, // 1. Auth check
    foodController.saveFood // 2. Controller run hoga   
    )

// routes/food.routes.js
router.get("/saved-items", authMiddlewares.authUserMiddleware, foodController.getSavedFoods);

module.exports = router ; // router ko export kiya gaya hai taki dusre files me use kiya ja sake