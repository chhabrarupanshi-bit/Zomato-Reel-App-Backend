const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");


async function foodPartnerMiddleware(req, res, next) {
    console.log("🟡 [PARTNER-AUTH] Middleware triggered for:", req.method, req.originalUrl);

    // 1. Safe extraction from Cookies or Authorization Header
    const token =
        req.cookies?.foodPartnertoken ||
        req.cookies?.token ||
        req.headers.authorization?.split(" ")[1];

    console.log("🟡 [PARTNER-AUTH] Token found:", token ? "YES" : "NO");

    if (!token) {
        console.log("🔴 [PARTNER-AUTH] Rejecting: No token provided");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // 2. Blacklist Check
        if (blacklistModel) {
            const isBlackListed = await blacklistModel.findOne({ token });
            if (isBlackListed) {
                console.log("🔴 [PARTNER-AUTH] Rejecting: Token is blacklisted");
                return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
            }
        }

        // 3. Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const partnerId = decoded.id || decoded._id;
        console.log("🟡 [PARTNER-AUTH] Decoded Partner ID:", partnerId);

        // 4. Find Partner in Database
        const foodPartner = await foodPartnerModel.findById(partnerId);
        if (!foodPartner) {
            console.log("🔴 [PARTNER-AUTH] Partner not found in DB for ID:", partnerId);
            return res.status(401).json({ message: "Unauthorized: Food partner not found" });
        }

        console.log("🟢 [PARTNER-AUTH] Partner Verified:", foodPartner.Businessname || foodPartner.name);
        req.foodPartner = foodPartner;
        next();
    } catch (error) {
        console.log("🔴 [PARTNER-AUTH] JWT Error:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token", error: error.message });
    }
}

async function authUserMiddleware(req, res, next) {
    console.log("🟡 [LIKE-DEBUG] authUserMiddleware chalu hua:", req.method, req.originalUrl);

    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

    console.log("🟡 [LIKE-DEBUG] Token mila:", token ? "HAAN mila" : "NAHI mila");

    if (!token) {
        console.log("🔴 [LIKE-DEBUG] Token nahi hai, 401 bhej rahe hain");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        if (blacklistModel) {
            const isBlackListedToken = await blacklistModel.findOne({ token });
            if (isBlackListedToken) {
                console.log("🔴 [LIKE-DEBUG] Token blacklisted hai");
                return res.status(401).json({ message: "Unauthorized token is blacklisted" });
            }
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded._id;
        console.log("🟡 [LIKE-DEBUG] Decoded ID:", userId);

        const user = await userModel.findById(userId);
        if (!user) {
            console.log("🔴 [LIKE-DEBUG] User database me nahi mila");
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        console.log("🟢 [LIKE-DEBUG] User verified! Aage bhej rahe hain:", user._id);
        req.user = user;
        next();
    } catch (err) {
        console.log("🔴 [LIKE-DEBUG] JWT verify FAIL hua:", err.message);
        return res.status(401).json({ message: "Unauthorized verification failed", error: err.message });
    }
}

async function authUserOrPartner(req, res, next) {
    const token =
        req.cookies?.token ||
        req.cookies?.foodPartnertoken ||
        req.headers.authorization?.split(" ")[1];

    console.log("1. Backend received token:", token ? "YES" : "NO");

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        if (blacklistModel) {
            const isBlacklisted = await blacklistModel.findOne({ token });
            if (isBlacklisted) {
                console.log("2. Token is blacklisted!");
                return res.status(401).json({ message: "Token is blacklisted" });
            }
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const targetId = decoded.id || decoded._id;
        console.log("3. Decoded ID:", targetId);

        let user = await userModel.findById(targetId);
        if (user) {
            console.log("4. User found");
            req.user = user;
            return next();
        }

        let partner = await foodPartnerModel.findById(targetId);
        if (partner) {
            console.log("5. Partner found:", partner.Businessname || partner.name);
            req.foodPartner = partner;
            return next();
        }

        console.log("6. Neither user nor partner found for ID:", targetId);
        return res.status(401).json({ message: "Account not found" });
    } catch (err) {
        console.log("7. JWT Verify Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
}

module.exports = { foodPartnerMiddleware, authUserMiddleware, authUserOrPartner };