import { Router } from "express";
import { 
  getArticles, 
  getFavoriteArticles, 
  addLikeArticle, 
  deleteLikeArticle 
} from "../models/articles.js";

const router = Router();

// Получение списка статьей, с фильрацией по тегу
router.get("/articles", getArticles);

// Получение статей которые лайкнул пользователь
router.get("/articles/favorites", getFavoriteArticles);

// Добавление в список лайков, нового юзера
router.post("/articles/add-like", addLikeArticle);

// Удаление юзера из списка лайков
router.post("/articles/delete-like", deleteLikeArticle);

export default router;
