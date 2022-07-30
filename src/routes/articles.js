import { Router } from "express";
import Articles from "../controllers/articles.js";

const router = Router();

/**
 * Получение одной статьи по id
 * @param {string} id - id ресурса
 */
router.get("/article", Articles.getArticle);

/**
 * Получение списка статьей, с фильрацией по тегу
 * @param {string} tag - Название фильтра
 */
router.get("/articles", Articles.getArticleList);

/**
 * Получение статей которые лайкнул пользователь
 */
router.get("/articles/favorites", Articles.getFavoriteArticleList);

/**
 * Получение рандомных статьей
 * @param {string|undefined} id - id ресурса которое не должно быть среди результатов
 */
router.get("/articles/popular-articles", Articles.getPopularArticleList);

/**
 * Получение тэгов статей
 */
router.get("/articles/tags", Articles.getTagList);

/**
 * Увеличение количества просмотров статьи
 * @param {string} id - id статьи
 */
router.put("/articles/add-view", Articles.addView);

export default router;