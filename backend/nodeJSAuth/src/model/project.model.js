import mongoose from "mongoose";
import { Schema } from "mongoose";

const projectSchema = mongoose.Schema({
    projectName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["planning", "active", "completed", "archived"],
        default: "planning",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User",
    }],
    dueDate: {
        type: Date
    },
},
    {
        timestamps: true
    }
);

export const Project = mongoose.model("Project", projectSchema);