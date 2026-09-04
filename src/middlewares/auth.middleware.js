const foodPartnerModel = require("../models/foodpartner.model");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const userModel = require("../models/user.model");

// Helper function to extract and sanitize token
function extractToken(req) {
    let token =
        req.cookies?.foodPartnertoken ||
        req.cookies?.token;

    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization.trim();
        token = authHeader.startsWith("Bearer ")
            ? authHeader.slice(7).trim()
            : authHeader;
    }

    // Strip accidental wrapping quotes
    return token ? token.replace(/^["']|["']$/g, "") : null;
}

async function foodPartnerMiddleware(req, res, next) {
    console.log("🟡 [PARTNER-AUTH] Middleware triggered for:", req.method, req.originalUrl);

    const token = extractToken(req);
    console.log("🟡 [PARTNER-AUTH] Token found:", token ? "YES" : "NO");

    if (!token) {
        console.log("🔴 [PARTNER-AUTH] Rejecting: No token provided");
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        if (blacklistModel) {
            const isBlackListed = await blacklistModel.findOne({ token });
            if (isBlackListed) {
                console.log("🔴 [PARTNER-AUTH] Rejecting: Token is blacklisted");
                return res.status(401).json({ message: "Unauthorized: Token is blacklisted" });
            }
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const partnerId = decoded.id || decoded._id;
        console.log("🟡 [PARTNER-AUTH] Decoded Partner ID:", partnerId);

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
        return res.status(401).json({ message: "Unauthorized: " + error.message });
    }
}

async function authUserMiddleware(req, res, next) {
    console.log("🟡 [USER-AUTH] authUserMiddleware triggered for:", req.method, req.originalUrl);

    const token = extractToken(req);
    console.log("🟡 [USER-AUTH] Token found:", token ? "YES" : "NO");

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        if (blacklistModel) {
            const isBlackListedToken = await blacklistModel.findOne({ token });
            if (isBlackListedToken) {
                return res.status(401).json({ message: "Unauthorized token is blacklisted" });
            }
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded._id;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: " + err.message });
    }
}

async function authUserOrPartner(req, res, next) {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        if (blacklistModel) {
            const isBlacklisted = await blacklistModel.findOne({ token });
            if (isBlacklisted) {
                return res.status(401).json({ message: "Token is blacklisted" });
            }
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const targetId = decoded.id || decoded._id;

        const user = await userModel.findById(targetId);
        if (user) {
            req.user = user;
            return next();
        }

        const partner = await foodPartnerModel.findById(targetId);
        if (partner) {
            req.foodPartner = partner;
            return next();
        }

        return res.status(401).json({ message: "Account not found" });
    } catch (err) {
        return res.status(401).json({ message: "Invalid token: " + err.message });
    }
}

module.exports = { foodPartnerMiddleware, authUserMiddleware, authUserOrPartner };