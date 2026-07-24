import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workspaces",
        required: true
    },
    assignTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }],
    assignBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    status: {
        type: String,
        enum: ["Todo", "In-progress", "Done"],
        default: "Todo"
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Medium"
    },
    dueDate: {
        type: Date,
    }
}, { timestamps: true })

export const taskModel = mongoose.model("Tasks", taskSchema)