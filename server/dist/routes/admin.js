"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = __importDefault(require("../models/user_model"));
const course_model_1 = __importDefault(require("../models/course_model"));
const auth_middleware_1 = require("../middleware/auth_middleware");
const router = express_1.default.Router();
// View all users (filter by role)
router.get("/users", auth_middleware_1.protect, auth_middleware_1.adminOnly, async (req, res) => {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await user_model_1.default.find(filter);
    res.json(users);
});
// Add instructor
router.post("/instructors", auth_middleware_1.protect, auth_middleware_1.adminOnly, async (req, res) => {
    const { name, email, password } = req.body;
    const user = new user_model_1.default({ name, email, password, role: "instructor" });
    await user.save();
    res.status(201).json(user);
});
// Update instructor
router.put("/instructors/:id", auth_middleware_1.protect, auth_middleware_1.adminOnly, async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await user_model_1.default.findByIdAndUpdate(id, { name, email }, { new: true });
    res.json(user);
});
// Delete instructor
router.delete("/instructors/:id", auth_middleware_1.protect, auth_middleware_1.adminOnly, async (req, res) => {
    const { id } = req.params;
    await user_model_1.default.findByIdAndDelete(id);
    res.json({ message: "Instructor deleted" });
});
// Add course
router.post("/courses", auth_middleware_1.protect, auth_middleware_1.adminOnly, async (req, res) => {
    const { title, description, instructor } = req.body;
    const course = new course_model_1.default({ title, description, instructor, students: [] });
    await course.save();
    res.status(201).json(course);
});
// Update course
router.put("/courses/:id", auth_middleware_1.protect, auth_middleware_1.adminOnly, async (req, res) => {
    const { id } = req.params;
    const { title, description, instructor } = req.body;
    const course = await course_model_1.default.findByIdAndUpdate(id, { title, description, instructor }, { new: true });
    res.json(course);
});
// Delete course
router.delete("/courses/:id", auth_middleware_1.protect, auth_middleware_1.adminOnly, async (req, res) => {
    const { id } = req.params;
    await course_model_1.default.findByIdAndDelete(id);
    res.json({ message: "Course deleted" });
});
// View enrolled students in a course
router.get("/courses/:id/enrollments", auth_middleware_1.protect, auth_middleware_1.adminOnly, async (req, res) => {
    const { id } = req.params;
    const course = await course_model_1.default.findById(id).populate("students", "name email");
    if (!course)
        return res.status(404).json({ message: "Course not found" });
    res.json(course.studentIds);
});
exports.default = router;
