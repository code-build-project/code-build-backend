import { Router } from "express";
import Courses from "../controllers/courses.js";

const router = Router();

/**
 * Получение однго курса по id
 * @param {string} id - id ресурса
 */
router.get("/course", Courses.getCourse);

/**
 * Получение списка курсов, с фильтром по тегу
 * @param {string} tag - Название фильтра
 */
router.get("/courses", Courses.getCourseList);

/**
 * Получение курсов которые лайкнул пользователь
 */
router.get("/courses/favorites", Courses.getFavoriteCourseList);

/**
 * Получение рандомных курсов
 * @param {string|undefined} id - id ресурса которое не должно быть среди результатов
 */
router.get("/courses/popular-courses", Courses.getPopularCourseList);

export default router;
