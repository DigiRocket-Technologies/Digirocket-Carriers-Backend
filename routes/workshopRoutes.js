import {Router} from "express"
import { create_checkout_session } from "../controllers/workshopController.js";

const router = Router();

router.post("/create-checkout-session",create_checkout_session)

export default router