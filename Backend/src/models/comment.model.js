import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tasks"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    text: {
        type: String,
        required: true
    }
}, { timestamps: true })

const commentModel = mongoose.model("Comments", commentSchema)

export default commentModel
