"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = __importDefault(require("../models/user_model"));
const course_model_1 = __importDefault(require("../models/course_model"));
const auth_middleware_1 = require("../middleware/auth_middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// Get available courses (not enrolled)
router.get("/courses/available", auth_middleware_1.protect, auth_middleware_1.studentOnly, async (req, res) => {
    const userId = req.user._id;
    const courses = await course_model_1.default.find({ students: { $ne: userId } }).populate("instructor", "name");
    res.json(courses);
});
// Enroll in a course
router.post("/courses/:id/enroll", auth_middleware_1.protect, auth_middleware_1.studentOnly, async (req, res) => {
    const userId = new mongoose_1.default.Types.ObjectId(req.user.id);
    const { id } = req.params;
    const course = await course_model_1.default.findById(id);
    if (!course)
        return res.status(404).json({ message: "Course not found" });
    if (course.studentIds.some((studentId) => studentId.equals(userId)))
        return res.status(400).json({ message: "Already enrolled" });
    course.studentIds.push(userId);
    await course.save();
    res.json({ message: "Enrolled successfully" });
});
// Get registered courses
router.get("/courses/registered", auth_middleware_1.protect, auth_middleware_1.studentOnly, async (req, res) => {
    const userId = req.user._id;
    const courses = await course_model_1.default.find({ students: userId }).populate("instructor", "name");
    res.json(courses);
});
// Get student profile
router.get("/profile", auth_middleware_1.protect, auth_middleware_1.studentOnly, async (req, res) => {
    const user = await user_model_1.default.findById(req.user._id).select("-password");
    res.json(user);
});
// Update student profile
router.put("/profile", auth_middleware_1.protect, auth_middleware_1.studentOnly, async (req, res) => {
    const { name, email } = req.body;
    const user = await user_model_1.default.findByIdAndUpdate(req.user._id, { name, email }, { new: true }).select("-password");
    res.json(user);
});
exports.default = router;
