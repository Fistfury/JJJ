import { Router } from "express";
import { createSubscription, getSubscriptionLevels, updateSubscription } from "../controllers/SubscriptionController";

const router = Router();

router.get("/", getSubscriptionLevels);
router.post("/create", createSubscription);
router.put("/update:id", updateSubscription);

export default router;