const foodModel = require("../models/food.model") ; // food.model.js file me foodModel ko import kiya gaya hai taki food collection ke liye schema define kiya ja sake  
const storageService = require("../services/storage.service") ; // storage.service.js file me storageService ko import kiya gaya hai taki image ko upload kiya ja sake
const crypto = require("crypto") ; // crypto package ko import kiya gaya hai taki unique id generate kiya ja sake
const likeModel = require("../models/likes.model") ; // likes.model.js file me likeModel ko import kiya gaya hai taki likes collection ke liye schema define kiya ja sake
const saveModel = require("../models/save.model") ; // save.model.js file me saveModel ko import kiya gaya hai taki save collection ke liye schema define kiya ja sake
async function createFood(req, res) {
    try{
    console.log( "Logging food partner:" ,req.foodPartner) ; // food partner ke liye request object me foodPartner ko log kiya jata hai taki check kiya ja sake ki food partner exist karta hai ya nahi

  const uniqueId = crypto.randomUUID(); // crypto package ka randomUUID function use kiya jata hai taki unique id generate kiya ja sake
    console.log("Unique ID" , uniqueId) ; // unique id generate kiya jata hai taki food ke liye unique id create kiya ja sake

    // 1. Cloudinary/ImageKit par upload karein
    const uploadFileResult =  await storageService.uploadFile(req.file.buffer, `${uniqueId}.mp4`);; // storage.service.js file me uploadFile function ko call kiya jata hai taki image ko upload kiya ja sake
    console.log("Upload Result" , uploadFileResult) ;

    // 2. Database mein food item create karein
    const foodItem = await foodModel.create({
        name : req.body.name ,
        description : req.body.description ,
        vedios : uploadFileResult.url , // uploadFileResult me url ko store kiya jata hai taki image ka url database me store kiya ja sake
        foodPartner : req.foodPartner._id , // req object me foodPartner ko store kiya jata hai taki food partner ke saath relation establish kiya ja sake
    }) 

    // 3. Postman / Frontend ko success response bhejein
    return res.status(201).json({
        message : "Food item created successfully" ,
        foodItem : {
            food_Item_id : foodItem._id ,
            food_Item_name : foodItem.name ,
            food_Item_description : foodItem.description ,
            food_Item_vedios : foodItem.vedios ,
            food_Item_foodPartner : foodItem.foodPartner ,
            food_Item_Businessname : req.foodPartner.Businessname ,
        } , 
    })

    }
    catch(err){
        console.log(err) ; // agar error aata hai to error ko log kiya jata hai taki check kiya ja sake ki error kahan aaya hai
        return res.status(500).json({
            message : "Internal Server Error" , // agar error aata hai to 500 status code ke sath message return kiya jata hai
            error : err.message , // error message ko response me bheja jata hai taki frontend me access kiya ja sake
        })
    }
}

async function getFoodItems(req,res){
    const foodItems = await foodModel.find({}) ; // food collection me find function ko call kiya jata hai taki saare food items ko access kiya ja sake
    
    return res.status(200).json({
        message : "Food items fetched successfully" ,
        foodItems : foodItems , // food items ko response me bheja jata hai taki frontend me access kiya ja sake
    })

}

async function likeFood(req,res){
    try {
        const { foodId } = req.body;

        if (!foodId || !req.user?._id) {
            return res.status(400).json({ message: "foodId and logged-in user are required" });
        }

        const foodItem = await foodModel.findById(foodId);
        if (!foodItem) {
            return res.status(404).json({ message: "Food item not found" });
        }

        const existingLike = await likeModel.findOne({
            food: foodId,
            user: req.user._id,
        });

        let liked;
        if (existingLike) {
            await likeModel.deleteOne({ _id: existingLike._id });
            liked = false;
        } else {
            await likeModel.create({
                food: foodId,
                user: req.user._id,
            });
            liked = true;
        }

        const likeCount = await likeModel.countDocuments({ food: foodId });
        console.log(`Like updated: food=${foodId}, user=${req.user._id}, liked=${liked}, count=${likeCount}`);

        return res.status(200).json({
            message: liked ? "Food item liked successfully" : "Food item unliked successfully",
            liked,
            likeCount,
        });
    } catch (error) {
        console.error("Like request failed:", error);
        return res.status(500).json({
            message: "Unable to update like",
            error: error.message,
        });
    }

}

async function saveFood(req, res) {
  try {
    const { foodId } = req.body;
    const userId = req.user._id;

    const existingSave = await saveModel.findOne({ food: foodId, user: userId });

    if (existingSave) {
      await saveModel.deleteOne({ food: foodId, user: userId });
      return res.status(200).json({
        saved: false, // Flag add kiya
        message: "Food item unsaved successfully",
      });
    }

    await saveModel.create({
      food: foodId,
      user: userId,
    });

    return res.status(201).json({
      saved: true, // Flag add kiya
      message: "Food item saved successfully",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// controller/food.controller.js
async function getSavedFoods(req, res) {
  try {
    const userId = req.user._id;
    const saves = await saveModel.find({ user: userId }).populate("food");
    
    // Sirf populate hua food object filter karke bhejna hai
    const savedFoods = saves.map((item) => item.food).filter(Boolean);

    return res.status(200).json({ savedFoods });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = {createFood , getFoodItems , likeFood , saveFood , getSavedFoods} ; // createFood function ko export kiya jata hai taki dusre files me use kiya ja sake