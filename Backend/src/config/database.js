import mongoose from "mongoose";
import { config } from "./config.js";

const connectToDb = async () => {
    try {
        await mongoose.connect(config.MONGO_URI)
        console.log('DB connected successfully');
    } catch (err) {
        console.log(`Error connecting to database: ${err.message}`);
        process.exit(1)
    }
}

export default connectToDb;