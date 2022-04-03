import { Router } from "express";
import reviews from "../controllers/reviews.js";

const router = Router();

/**
 * Получение списка отзывов
 */
router.get("/reviews", reviews.getReviews);

export default router;
