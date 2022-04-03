import { Router } from "express";
import likes from "../controllers/likes.js";

const router = Router();

/**
 * Получение списка лайков для юзера
 * @param {string} field - Название поля (articles, courses, lessons)
 */
router.get("/likes", likes.getLikeList);

/**
 * Добавление в список лайков, id карточки
 * @param {string} field - Название поля (articles, courses, lessons)
 * @param {string} id - id ресурса которому поставили лайк
 */
router.put("/likes/add", likes.addLike);

/**
 * Удаление юзера из списка лайков
 * @param {string} field - Название поля (articles, courses, lessons)
 * @param {string} id - id ресурса у которого убрали лайк
 */
router.put("/likes/delete", likes.deleteLike);

export default router;
