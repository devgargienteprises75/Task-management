import Redis from "ioredis";
import { config } from "./config.js";

export const redis = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD
})

redis.on("connect", () => {
    console.log("Redis connected successfully")
})

redis.on("error", (err) => {
    console.log("Redis connection failed: ", err)
})