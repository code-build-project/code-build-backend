import { Router } from "express";
import Lessons from "../controllers/lessons.js";

const router = Router();

/**
 * Получение списка уроков указанного курса
 * @param {string} courseId - id ресурса
 */
router.get("/lessons", Lessons.getCourseLessons);

/**
 * Получение уроков которые лайкнул пользователь
 */
router.get("/lessons/favorites", Lessons.getFavoriteLessons);

export default router;
