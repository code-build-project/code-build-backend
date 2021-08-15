import { Router } from "express";
import { getReviews } from "../controllers/reviews.js";

const router = Router();

// Получение списка отзывов
router.get("/reviews", getReviews);

export default router;
