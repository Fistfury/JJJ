import { ObjectId } from "mongodb";
import { connectToDatabase } from "../config/db";
import { NextFunction, Request, Response } from "express";
import { SubscriptionLevel } from "../models/SubscriptionModel";
import { stripe } from "../config/stripe";

interface User {
    email: string;
    password: string;
    stripeCustomerId: string;
}

interface Admin {
    email: string;
    password: string;
}

interface Session {
    user? : User;
    admin? : Admin;
}

export const getSubscriptionLevels = async (req: Request, res: Response) => {

    let email = (req.session as Session).user?.email
    console.log(email);
    try { 
    const db = await connectToDatabase();
    const user = await db.collection('subscriptions').findOne({ "email": email });
    res.json(user?.subscriptionLevel);
    console.log(user?._id);
    } catch (error) {
    res.status(500).send('Error getting subscription levels');
    }
};

export const createSubscription = async (req: Request, res: Response) => {
    console.log(req.body);
    const { subscriptionLevel, stripeCustomerId, paymentIntentId } = req.body;
    if (!stripeCustomerId) {
        return res.status(400).json({ error: 'Stripe customer ID is required' });
      }
    console.log(stripeCustomerId, paymentIntentId, subscriptionLevel);
    let email = (req.session as Session).user?.email
  
    try {
      const db = await connectToDatabase();
      const user = db.collection("user");
      const collection = db.collection("subscriptions");
      const userExists = await collection.findOne({ "email": email });

      const customer = await stripe.customers.retrieve(stripeCustomerId);
      console.log(customer);
    //   const subscriptionLevel = customer.metadata.subscriptionLevel;
  
      if (userExists && userExists.subscriptionLevel === subscriptionLevel) {
        return res.status(409).json("Already subscribed");
  
      } else if (userExists && userExists.subscriptionLevel !== subscriptionLevel) {
        const result = await collection.updateOne({"email": email}, {$set: {"subscriptionLevel": subscriptionLevel, "startDate": new Date(), "status": "active", "stripeCustomerId": stripeCustomerId, "paymentId": paymentIntentId}});        return res.status(201).json({"message": "Subscription updated"});
        
      } else {
        const result = await collection.insertOne({
          "email": email, 
          "subscriptionLevel": subscriptionLevel, 
          "startDate": new Date(),
          "stripeCustomerId": stripeCustomerId,
          "paymentId": paymentIntentId,
          "status": "active"
        });
        const createdSubscription = await user.findOne({ email, subscriptionLevel });
        res.status(201).json(createdSubscription);
      } 
    } catch (error) {
      console.error("Error creating subscription:", error);
      res.status(500).send("Error creating subscription");
    }
  };

    export const updateSubscription = async (req: Request, res: Response) => {
        const { subscriptionLevel } = req.body;
        let email = (req.session as Session).user?.email
    
        try {
        const db = await connectToDatabase();
        const user = db.collection("user");
        const collection = db.collection("subscriptions");
        const userExists = await collection.findOne({ "email": email });
    
        if (userExists && userExists.subscriptionLevel === subscriptionLevel) {
            return res.status(409).json("Already subscribed");
    
        } else if (userExists && userExists.subscriptionLevel !== subscriptionLevel) {
            const result = await collection.updateOne({"email": email}, {$set: {"subscriptionLevel": subscriptionLevel, "startDate": new Date()}});
            return res.status(201).json({"message": "Subscription updated"});
            
        } 
        } catch (error) {
            console.error("Error creating subscription:", error);
            res.status(500).send("Error creating subscription");
        }
        };

    
    export const pauseSubscription = async (req: Request, res: Response) => {
        try {
        const db = await connectToDatabase();
        const email = (req.session as Session).user?.email;
        console.log(email);

        const subscription = await db.collection('subscriptions').findOne({ "email": email });
        const _id = subscription?._id;
        console.log("_id:", _id);

        await db.collection('subscriptions').updateOne({ _id: new ObjectId(_id) }, { $set: { subscriptionLevel: "noob" } });
        // TODO JLo: check date 
        
        res.json("Subscription paused");
                
        } catch (error) {
            console.error("Error pausing subscription:", error);
            res.status(500).send("Error pausing subscription");
        }
    };

    export const getSubscriptionStatus = async (req: Request, res: Response) => {
        const email = (req.session as Session).user?.email;
        if (!email) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
    
        try {
            const db = await connectToDatabase();
            const subscription = await db.collection('subscriptions').findOne({ email });
            if (!subscription) {
                return res.status(404).json({ error: 'Subscription not found' });
            }
            const updateUrl = 'https://billing.stripe.com/p/subscription/update_payment_method_link/CBcaFwoVYWNjdF8xUDFURU9SdFJDYVpYeUV4KJawp7MGMgbxUAHWDDA6OtajftwlKw6z_4w0BLG-e8faTeDuO6shxnQbbFXtFfwTsXkUrQUACtIkHKqim82LScK9MOzVGtSI4_g';  // Dynamiskt generera denna URL eller hämta från konfiguration
            res.json({ status: subscription.status, updateUrl: updateUrl });
        } catch (error) {
            console.error("Error fetching subscription status:", error);
            res.status(500).send("Error fetching subscription status");
        }
    };


/* export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
    const db = await connectToDatabase();
    const email = req.headers['email'] as string;
    // TODO JLo: get user or id from session

    const user = await db.collection('user').findOne({ email });

    if(!user) {
        return res.status(404).send('User not found');
    }

    const articles = await db.collection('articles').find({}).toArray();
    res.json(articles);

    if (user.subscriptionLevel !== articles.subscriptionLevel) {

    }
  };
 */
    // TODO JLo: get articles sub lvl 
      // hämta user sub lvl
      // filtrera artiklar baserat på user sub lvl
      // lte > less than or equal