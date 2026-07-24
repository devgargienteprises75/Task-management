import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: "Users"
    }],
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    isGeneral: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export const workspaceModel = mongoose.model("Workspaces", workspaceSchema)
