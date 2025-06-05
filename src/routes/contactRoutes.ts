import {Router} from "express"
import { bookDemo, contactUs } from "../controllers/contactControllers";


const router = Router();


router.post("/contact-us",contactUs)
router.post("/bookdemo",bookDemo)

export default router