import {Router} from "express"
import { create_checkout_session, create_razorpay_order} from "../controllers/workshopController.js";

const router = Router();

router.post("/create-checkout-session",create_checkout_session);
router.post("/create-razorpay-order",create_razorpay_order);

export default router