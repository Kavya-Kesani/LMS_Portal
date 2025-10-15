"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const courseSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    instructor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    studentIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    duration: {
        type: String,
        required: true,
        default: "8 weeks",
    },
    level: {
        type: String,
        enum: ["Beginner", "Intermediate", "Advanced"],
        required: true,
        default: "Beginner",
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 4.5,
    },
    price: {
        type: String,
        required: true,
        default: "$99",
    },
    syllabus: [
        {
            type: String,
            trim: true,
        },
    ],
    prerequisites: [
        {
            type: String,
            trim: true,
        },
    ],
    learningOutcomes: [
        {
            type: String,
            trim: true,
        },
    ],
    totalLessons: {
        type: Number,
        default: 0,
        min: 0,
    },
    estimatedHours: {
        type: Number,
        default: 40,
        min: 0,
    },
    language: {
        type: String,
        default: "English",
        trim: true,
    },
    certificate: {
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "published",
    },
    thumbnail: {
        type: String,
        trim: true,
    },
    videoIntro: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
// Add indexes for better performance
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ level: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ title: "text", description: "text" });
const Course = mongoose_1.default.model("Course", courseSchema);
exports.default = Course;
