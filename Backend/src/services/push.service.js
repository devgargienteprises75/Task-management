
import webpush from "web-push";
import { subscriptionModel } from "../models/subscription.model.js";

export async function sendPushToUser(userId, payload){
    const subscription = await subscriptionModel.find({ user: userId })
    if(subscription.length === 0) return;

    const payloadString = JSON.stringify(payload)
    const results = await Promise.allSettled(
        subscription.map(sub => 
            webpush.sendNotification(sub, payloadString)
        )
    )

    for(let i = 0; i < results.length; i++){
        const result = results[i];
        if(result.status === "rejected"){
            const err = result.reason
            if(err.statusCode === 410){
                await subscriptionModel.deleteOne({
                    endpoint: subscription[i].endpoint,
                })
            }
        }
    }
}