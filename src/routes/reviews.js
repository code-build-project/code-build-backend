import { Router } from "express";
import Reviews from "../controllers/reviews.js";

const router = Router();

/**
 * Получение списка отзывов
 */
router.get("/reviews", Reviews.getList);

export default router;