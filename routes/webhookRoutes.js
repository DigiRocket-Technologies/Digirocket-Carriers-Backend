import {Router} from "express"
import { workshopWebhook } from "../controllers/webhookControllers.js";

const router = Router();

router.post("/workshop",workshopWebhook)

export default router