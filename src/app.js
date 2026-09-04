// routes and server ki requests ko handle karne ke liye express ka use kiya jata hai
require("dotenv").config() ; // dotenv package ko import kiya gaya hai taki environment variables ko access kiya ja sake
const express = require("express") ; // app.js file me express ko import kiya gaya hai
const connectDB = require("./db/db") ; // db.js file me connectDb function ko export kiya gaya tha
const cookieParser = require("cookie-parser") ; // cookie-parser package ko import kiya gaya hai taki cookies ko parse kiya ja sake
const authRoutes = require("./routes/auth.routes") ; // auth.routes.js file me router ko export kiya gaya tha taki user registration aur login ke liye routes define kiya ja sake
const foodRoutes = require("./routes/food.routes") ; // food.routes.js file me router ko export kiya gaya tha taki food related routes define kiya ja sake
const foodPartnerRoutes = require("./routes/food-partner.route") ; // food-partner.route.js file me router ko export kiya gaya tha taki food partner related routes define kiya ja sake
const app = express(); // app.js file me express ka instance create kiya gaya hai
const cors = require("cors") ; // cors package ko import kiya gaya hai taki cross-origin requests ko allow kiya ja sake
app.use(cors({
    origin : ["http://localhost:5173" , 
    "http://localhost:3000",
    "https://zomato-reel-app.vercel.app" ],// Aapka live Vercel frontend URL// frontend ke liye origin ko allow kiya jata hai taki frontend se backend ke liye requests bheji ja sake
    credentials : true , // credentials ko allow kiya jata hai taki cookies ko access kiya ja sake
})) ;
app.use(express.json()) ; // express ka json middleware use kiya gaya hai taki request body ko json format me parse kiya ja sake
app.use(cookieParser()) ; // cookie-parser middleware ko use kiya gaya hai taki cookies ko parse kiya ja sake

// Purana connectDB(); hata kar yeh likhein:
app.use(async (req, res, next) => {
  await connectDB();
  next();
});  // connectDb function ko call kiya gaya hai taki MongoDB se connection establish ho sake

app.get("/" , (req,res) => { // "/" route ke liye GET request handle ki ja rahi hai
    res.send("Hello Everyone")
})
app.get("/", (req, res) => {
  res.status(200).send("Hello Everyone! Backend is live and running.");
});

app.use("/api/food" , foodRoutes) ; // "/api/food" route ke liye foodRoutes ko use kiya gaya hai taki food related routes define kiya ja sake

app.use("/api/auth" , authRoutes) ; // "/api/auth" route ke liye authRoutes ko use kiya gaya hai taki user registration aur login ke liye routes define kiya ja sake

app.use('/api/food-partner' , foodPartnerRoutes) ; // "/api/food-partner" route ke liye foodPartnerRoutes ko use kiya gaya hai taki food partner related routes define kiya ja sake


module.exports = app;