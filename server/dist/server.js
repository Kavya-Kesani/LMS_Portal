"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// CORS - Allow frontend to connect
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
}));
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Simple test route
app.get("/", (req, res) => {
    res.json({ message: "Server is running!" });
});
// Import and use routes
const auth_1 = __importDefault(require("./routes/auth"));
const course_1 = __importDefault(require("./routes/course"));
const instructor_1 = __importDefault(require("./routes/instructor"));
app.use("/api/auth", auth_1.default);
app.use("/api/courses", course_1.default);
app.use("/api/instructor", instructor_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});
// Start server
const startServer = async () => {
    try {
        if (process.env.MONGO_URI) {
            await mongoose_1.default.connect(process.env.MONGO_URI);
            console.log("✅ MongoDB connected");
        }
        else {
            console.log("⚠️ No MONGO_URI found, running without database");
        }
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Server startup error:", error);
        process.exit(1);
    }
};
startServer();
