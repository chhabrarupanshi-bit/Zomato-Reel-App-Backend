const express = require('express');
const router = express.Router();
const authMiddlewares = require('../middlewares/auth.middleware');

const foodPartnerController = require("../controller/food-partner.controller");

// Route to get food partner by ID


// GET /api/food-partner/:id
router.get('/:id', 
  // authMiddlewares.authUserOrPartner, // 1. Auth check
    foodPartnerController.getFoodPartnerById        // 2. Controller run hoga
) 


module.exports = router;