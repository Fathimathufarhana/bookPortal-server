import express from "express";
import { addReview } from "../controllers/reviewController.js";
import authCheck from "../middlewares/authCheck.js";
import { check } from "express-validator";

const router = express.Router()

router.use(authCheck);
router.post('/add/review',
[
    check('book').not().isEmpty(),
    check('rating').not().isEmpty(),
    check('review').not().isEmpty()
],addReview)

export default router
