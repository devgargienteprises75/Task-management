import 'dotenv/config'

if(!process.env.MONGO_URI){
    throw new Error("MONGO_URI id not defined in Environment variable")
}

if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET id not defined in Environment variable")
}

if(!process.env.REFRESH_TOKEN){
    throw new Error("REFRESH_TOKEN id not defined in Environment variable")
}

if(!process.env.CLIENT_ID){
    throw new Error("CLIENT_ID id not defined in Environment variable")
}

if(!process.env.CLIENT_SECRET){
    throw new Error("CLIENT_SECRET id not defined in Environment variable")
}

if(!process.env.USER_MAIL){
    throw new Error("USER_MAIL id not defined in Environment variable")
}

if(!process.env.PUBLIC_VAPID_KEY){
    throw new Error("PUBLIC_VAPID_KEY id not defined in Environment variable")
}

if(!process.env.PRIVATE_VAPID_KEY){
    throw new Error("PRIVATE_VAPID_KEY id not defined in Environment variable")
}

if(!process.env.REDIS_HOST){
    throw new Error("REDIS_HOST id not defined in Environment variable")
}

if(!process.env.REDIS_PORT){
    throw new Error("REDIS_PORT id not defined in Environment variable")
}

if(!process.env.REDIS_PASSWORD){
    throw new Error("REDIS_PASSWORD id not defined in Environment variable")
}

export const config = {
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    REFRESH_TOKEN:process.env.REFRESH_TOKEN,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    USER_MAIL:process.env.USER_MAIL,
    PUBLIC_VAPID_KEY:process.env.PUBLIC_VAPID_KEY,
    PRIVATE_VAPID_KEY:process.env.PRIVATE_VAPID_KEY,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PORT:process.env.REDIS_PORT,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD
}