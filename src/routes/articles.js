import { Router } from "express";
import { 
  getArticleList, 
  getArticle, 
  getFavoriteArticleList,
  getPopularArticleList
} from "../controllers/articles.js";

const router = Router();

// Получение списка статьей, с фильрацией по тегу
router.get("/articles", getArticleList);

// Получение одной статьи по id
router.get("/article", getArticle);

// Получение статей которые лайкнул пользователь
router.get("/articles/favorites", getFavoriteArticleList);

// Получение рандомных статьей
router.get("/articles/popular-articles", getPopularArticleList);

export default router;
