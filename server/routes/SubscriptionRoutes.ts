import { Router } from "express";
import {getSubscriptionLevels, createSubscription, pauseSubscription, updateSubscription, getSubscriptionStatus, /* getArticles */ } from "../controllers/SubscriptionController";

const router = Router();

router.get("/", getSubscriptionLevels);
router.post("/create", createSubscription);
router.put('/:_id', pauseSubscription);
//router.get("/articles", getArticles);
router.put('/update/:_id', updateSubscription);
router.get("/status", getSubscriptionStatus);

export default router;