const foodPartnerModel = require("../models/foodpartner.model");
const foodModel = require("../models/food.model"); // <-- Food model import karein

async function getFoodPartnerById(req, res) {
  const foodPartnerId = req.params.id;

  try {
    // 1. Partner Details fetch karein
    const foodPartner = await foodPartnerModel.findById(foodPartnerId);
    if (!foodPartner) {
      return res.status(404).json({ message: "Food Partner not found" });
    }

    // 2. Us partner ke saare food items/videos fetch karein
    const foods = await foodModel.find({ foodPartner: foodPartnerId });

    // 3. Frontend ke matching structure mein response bhejein
    return res.status(200).json({
      message: "Food Partner found",
      foodPartner: foodPartner,
      foods: foods,
    });
  } catch (error) {
    console.error("Error fetching food partner:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getFoodPartnerById,
};