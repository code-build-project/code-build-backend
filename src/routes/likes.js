import { Router } from "express";
import Likes from "../controllers/likes.js";

const router = Router();

/**
 * Получение списка лайков для юзера
 * @param {string} field - Название поля (articles, courses, lessons)
 */
router.get("/likes", Likes.getLikeList);

/**
 * Добавление в список лайков, id карточки
 * @param {string} field - Название поля (articles, courses, lessons)
 * @param {string} courseId - Название курса (только для поля lessons: html, css и т.п.)
 * @param {string} id - id ресурса которому поставили лайк
 */
router.put("/likes/add", Likes.addLike);

/**
 * Удаление юзера из списка лайков
 * @param {string} field - Название поля (articles, courses, lessons)
 * @param {string} id - id ресурса у которого убрали лайк
 */
router.put("/likes/delete", Likes.deleteLike);

export default router;