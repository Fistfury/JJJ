import { Router } from "express";
import { getSubscriptionLevels } from "../controllers/SubscriptionController";

const router = Router();

router.get("/", getSubscriptionLevels);

export default router;