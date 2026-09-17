import mongoose, { Schema } from "mongoose";

const taskSchema = mongoose.Schema({
    taskName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150
    },
    description: {
        type: String,
        required: true,
        maxlength: 2000
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["todo", "in-progress", "completed"],
        default: "todo",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium",
    },
    dueDate: {
        type: Date
    }
}, {
    timestamps: true
});

export const Task = mongoose.model("Task", taskSchema);