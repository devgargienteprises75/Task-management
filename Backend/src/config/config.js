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

export const config = {
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    REFRESH_TOKEN:process.env.REFRESH_TOKEN,
    CLIENT_ID:process.env.CLIENT_ID,
    CLIENT_SECRET:process.env.CLIENT_SECRET,
    USER_MAIL:process.env.USER_MAIL
}