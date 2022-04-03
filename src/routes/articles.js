import { Router } from "express";
import articles from "../controllers/articles.js";

const router = Router();

/**
 * Получение одной статьи по id
 * @param {string} id - id ресурса
 */
router.get("/article", articles.getArticle);

/**
 * Получение списка статьей, с фильрацией по тегу
 * @param {string} tag - Название фильтра
 */
router.get("/articles", articles.getArticleList);

/**
 * Получение статей которые лайкнул пользователь
 */
router.get("/articles/favorites", articles.getFavoriteArticleList);

/**
 * Получение рандомных статьей
 * @param {string|undefined} id - id ресурса которое не должно быть среди результатов
 */
router.get("/articles/popular-articles", articles.getPopularArticleList);

export default router;
