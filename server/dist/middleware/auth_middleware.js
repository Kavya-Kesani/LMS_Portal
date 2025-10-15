"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentOnly = exports.adminOnly = exports.instructorOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user_model"));
// Middleware to protect routes (JWT auth)
const protect = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, token missing" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await user_model_1.default.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.protect = protect;
// Middleware to allow only instructors
const instructorOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "instructor") {
        return res.status(403).json({ message: "Access denied. Instructors only." });
    }
    next();
};
exports.instructorOnly = instructorOnly;
// Middleware to allow only admins
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
exports.adminOnly = adminOnly;
// Middleware to allow only students
const studentOnly = (req, res, next) => {
    if (!req.user || req.user.role !== "student") {
        return res.status(403).json({ message: "Access denied. Students only." });
    }
    next();
};
exports.studentOnly = studentOnly;
