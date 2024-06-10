import { Router } from "express";
import {getSubscriptionLevels, createSubscription, pauseSubscription, /* getArticles */ } from "../controllers/SubscriptionController";

const router = Router();

router.get("/", getSubscriptionLevels);
router.post("/create", createSubscription);
router.put('/:id', pauseSubscription);
//router.get("/articles", getArticles);

export default router;