// Set up the Express app and this file is the entry point for the backend server
require("dotenv").config() ; // dotenv package ko import kiya gaya hai taki environment variables ko access kiya ja sake
const app = require("./src/app") ;


app.listen(3000 , () => {
    console.log("Server is running on port 3000") ;
})  