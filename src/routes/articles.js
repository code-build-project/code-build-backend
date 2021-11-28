import { Router } from "express";
import { 
  getArticles, 
  getArticle, 
  getFavoriteArticles, 
  addLikeArticle, 
  deleteLikeArticle 
} from "../controllers/articles.js";

const router = Router();

// Получение списка статьей, с фильрацией по тегу
router.get("/articles", getArticles);

// Получение одной статьи по id
router.get("/article", getArticle);

// Получение статей которые лайкнул пользователь
router.get("/articles/favorites", getFavoriteArticles);

// Добавление в список лайков, нового юзера
router.post("/articles/add-like", addLikeArticle);

// Удаление юзера из списка лайков
router.post("/articles/delete-like", deleteLikeArticle);

export default router;
