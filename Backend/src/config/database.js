import mongoose from "mongoose";
import { config } from "./config.js";
import dns from 'dns'

const connectToDb = async () => {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1'])
        await mongoose.connect(config.MONGO_URI)
        console.log('DB connected successfully');
    } catch (err) {
        console.log(`Error connecting to database: ${err.message}`);
        process.exit(1)
    }
}

export default connectToDb;