import {Router} from "express"
import { bookDemo, contactUs } from "../controllers/contactController.js";

const router = Router();

router.post("/contact-us",contactUs)
router.post("/bookdemo",bookDemo)

export default router