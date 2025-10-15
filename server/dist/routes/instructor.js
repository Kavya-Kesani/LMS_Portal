"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_model_1 = __importDefault(require("../models/course_model"));
const auth_middleware_1 = require("../middleware/auth_middleware");
const router = (0, express_1.Router)();
// GET /api/instructor/courses
router.get("/courses", auth_middleware_1.protect, auth_middleware_1.instructorOnly, async (req, res) => {
    try {
        const courses = await course_model_1.default.find({ instructor: req.user._id })
            .populate("instructor", "name email")
            .populate("studentIds", "name email");
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching instructor courses" });
    }
});
exports.default = router;
