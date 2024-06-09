import { Router } from "express";
import {getSubscriptionLevels, createSubscription, pauseSubscription } from "../controllers/SubscriptionController";

const router = Router();

router.get("/", getSubscriptionLevels);
router.post("/create", createSubscription);
router.put('/:id', pauseSubscription);

export default router;