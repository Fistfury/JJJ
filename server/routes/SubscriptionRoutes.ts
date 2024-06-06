import { Router } from "express";
import {getSubscriptionLevels, createSubscription, deleteSubscription } from "../controllers/SubscriptionController";

const router = Router();

router.get("/", getSubscriptionLevels);
router.post("/create", createSubscription);
router.delete('/:id', deleteSubscription);

export default router;