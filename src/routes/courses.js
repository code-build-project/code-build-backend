import { Router } from "express";
import courses from "../controllers/courses.js";

const router = Router();

/**
 * Получение однго курса по id
 * @param {string} id - id ресурса
 */
router.get("/course", courses.getCourse);

/**
 * Получение списка курсов, с фильтром по тегу
 * @param {string} tag - Название фильтра
 */
router.get("/courses", courses.getCourseList);

/**
 * Получение курсов которые лайкнул пользователь
 */
router.get("/courses/favorites", courses.getFavoriteCourseList);

/**
 * Получение рандомных курсов
 * @param {string|undefined} id - id ресурса которое не должно быть среди результатов
 */
router.get("/courses/popular-courses", courses.getPopularCourseList);

export default router;
