import { Router } from "express";
import lessons from "../controllers/lessons.js";

const router = Router();

/**
 * Получение списка уроков указанного курса
 * @param {string} courseId - id ресурса
 */
router.get("/lessons", lessons.getCourseLessons);

/**
 * Получение уроков которые лайкнул пользователь
 */
router.get("/lessons/favorites", lessons.getFavoriteLessons);

export default router;
