import { connectToDatabase } from "../config/db";
import { Request, Response } from "express";
import { SubscriptionLevel } from "../models/SubscriptionModel";

export const getSubscriptionLevels = async (req: Request, res: Response) => {
    try { 
    const db = await connectToDatabase();
    const subscriptionLevels = await db.collection('subscriptions').find({}).toArray();
    res.json(subscriptionLevels);
    } catch (error) {
    res.status(500).send('Error getting subscription levels');
    }
}

export const createSubscription = async (req: Request, res: Response) => {
    try {
    const db = await connectToDatabase();
    const user = db.collection("users");

    if (user) {
        const result = await user.insertOne({"_id": req.body._id, "subscriptionLevel": req.body.subscriptionLevel});
        const createdSubscription = await user.findOne({ _id: result.insertedId });
        res.status(201).json(createdSubscription);
        console.log("subscription created", result)
    } else {
        res.status(404).send("User not found");
    }   
    } catch (error) {
        res.status(500).send("Error creating subscription");
}
}