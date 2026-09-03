const userModel = require("../models/user.model");
const foodPartnerModel = require("../models/foodpartner.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

// ==================== USER CONTROLLERS ====================

async function registerUser(req, res) {
    try {
        const { fullName, email, password } = req.body;

        const isUserAlreadyExist = await userModel.findOne({ email: email });
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: "User already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullName: fullName,
            email: email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, { httpOnly: true });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                userid: user._id,
                username: user.fullName,
                useremail: user.email,
                usertoken: token,
            }
        });
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Password and Email" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Password and Email" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, { httpOnly: true });
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                userid: user._id,
                username: user.fullName,
                useremail: user.email,
                usertoken: token,
            }
        });
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function logoutUser(req, res) {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (token) {
            await blacklistModel.create({ token: token });
        }
        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// ==================== FOOD PARTNER CONTROLLERS ====================

async function registerFoodPartner(req, res) {
    try {
        const { Businessname, Ownername, phone, address, email, password } = req.body;

        const isAccountAlreadyExist = await foodPartnerModel.findOne({ email: email });
        if (isAccountAlreadyExist) {
            return res.status(400).json({ message: "Account already exist" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const foodPartner = await foodPartnerModel.create({
            Businessname: Businessname,
            Ownername: Ownername,
            phone: phone,
            address: address,
            email: email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true });

        return res.status(201).json({
            message: "Food Partner registered successfully",
            foodPartner: {
                foodPartnerid: foodPartner._id,
                foodPartnerBusinessname: foodPartner.Businessname,
                foodPartnerOwnername: foodPartner.Ownername,
                foodPartnerphone: foodPartner.phone,
                foodPartneraddress: foodPartner.address,
                foodPartneremail: foodPartner.email,
                foodPartnertoken: token,
            }
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

async function loginFoodPartner(req, res) {
    try {
        const { email, password } = req.body;

        const foodPartner = await foodPartnerModel.findOne({ email });
        if (!foodPartner) {
            return res.status(400).json({ message: "Invalid Email and Password" });
        }

        const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid Email and Password" });
        }

        const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET, {
            expiresIn: "7d" // Token 7 din ke liye valid rahega
        });

        // Cleaned up cookie configuration
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Set to true only in production over HTTPS
            sameSite: "lax", // Allows requests across ports on localhost
            path: "/",
            maxAge: 60 * 60 * 1000 // 1 hour (matches JWT expiration)
        });

        return res.status(200).json({
            message: "Food Partner logged in successfully",
            foodPartner: {
                foodPartnerid: foodPartner._id,
                foodPartnerBusinessname: foodPartner.Businessname,
                foodPartnerOwnername: foodPartner.Ownername,
                foodPartnerphone: foodPartner.phone,
                foodPartneraddress: foodPartner.address,
                foodPartneremail: foodPartner.email,
                foodPartnertoken: token,
            },
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
async function logoutFoodPartner(req, res) {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (token) {
            await blacklistModel.create({ token: token });
        }
        res.clearCookie("token");
        return res.status(200).json({ message: "Food Partner logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};