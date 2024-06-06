import { Router } from "express";
import {getSubscriptionLevels, updateSubscription } from "../controllers/SubscriptionController";

const router = Router();

router.get("/", getSubscriptionLevels);
//router.post("/create", createSubscription);
router.post("/update", updateSubscription);

export default router;