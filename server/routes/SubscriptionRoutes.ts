import { Router } from "express";
import {getSubscriptionLevels, createSubscription } from "../controllers/SubscriptionController";

const router = Router();

router.get("/", getSubscriptionLevels);
router.post("/create", createSubscription);

export default router;