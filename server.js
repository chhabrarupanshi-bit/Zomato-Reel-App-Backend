require("dotenv").config();
const app = require("./src/app");

// Local development ke liye app.listen, Vercel production par serverless handle karega
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// ⭐ VERCEL DEPLOYMENT KE LIYE ZAROORI ⭐
module.exports = app;