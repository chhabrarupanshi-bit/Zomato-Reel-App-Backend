const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");

async function foodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlackListed = await blacklistModel.findOne({ token: token });

    if (isBlackListed) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (!foodPartner) {
            return res.status(401).json({ message: "Unauthorized: Food partner not found" });
        }
        req.foodPartner = foodPartner;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

async function authUserMiddleware(req, res, next) {

    console.log("🟡 [LIKE-DEBUG] authUserMiddleware chalu hua:", req.method, req.originalUrl);

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    console.log("🟡 [LIKE-DEBUG] Token mila:", token ? "HAAN mila" : "NAHI mila");

    if (!token) {
        console.log("🔴 [LIKE-DEBUG] Token nahi hai, 401 bhej rahe hain");
        return res.status(401).json({ message: "Unauthorized" });
    }

    const isBlackListedToken = await blacklistModel.findOne({ token: token });

    if (isBlackListedToken) {
        console.log("🔴 [LIKE-DEBUG] Token blacklisted hai");
        return res.status(401).json({ message: "Unauthorized token is blacklisted" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🟡 [LIKE-DEBUG] Decoded ID:", decoded.id);

        const user = await userModel.findById(decoded.id);

        if (!user) {
            console.log("🔴 [LIKE-DEBUG] User database me nahi mila");
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        console.log("🟢 [LIKE-DEBUG] User verified! Aage bhej rahe hain:", user._id);

        req.user = user;

        next();
    }
    catch (err) {
        console.log("🔴 [LIKE-DEBUG] JWT verify FAIL hua:", err.message);
        return res.status(401).json({ message: "Unauthorized verification failed" });
    }
}

async function authUserOrPartner(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    console.log("1. Backend received token:", token);

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const isBlacklisted = await blacklistModel.findOne({ token });
        if (isBlacklisted) {
            console.log("2. Token is blacklisted!");
            return res.status(401).json({ message: "Token is blacklisted" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("3. Decoded ID:", decoded.id);

        let user = await userModel.findById(decoded.id);
        if (user) {
            console.log("4. User found");
            req.user = user;
            return next();
        }

        let partner = await foodPartnerModel.findById(decoded.id);
        if (partner) {
            console.log("5. Partner found:", partner.Businessname);
            req.foodPartner = partner;
            return next();
        }

        console.log("6. Neither user nor partner found for ID:", decoded.id);
        return res.status(401).json({ message: "Account not found" });

    } catch (err) {
        console.log("7. JWT Verify Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
}

module.exports = { foodPartnerMiddleware, authUserMiddleware, authUserOrPartner };