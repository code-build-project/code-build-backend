import { Router } from "express";
import {
  getArticles,
  addLikeArticle,
  deleteLikeArticle,
} from "../models/articles.js";

const router = Router();

// Получение списка статьей, с фильрацией по тегу
router.get("/articles", (req, res) => {

  getArticles("tags", req.query.tag)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
});

// Получение статей которые лайкнул пользователь
router.get("/articles/favorites", (req, res) => {

  getArticles("likes", req.query.userId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(401).json({
        message: `Ошибка: ${err}`,
      });
    });
});

// Добавление в список лайков, нового юзера
router.post("/articles/add-like", (req, res) => {
  addLikeArticle(req.body.articleId, req.body.userId)
    .then((response) => {
      console.log(response);
      res.send(response.value);
    })
    .catch(() => {
      console.log("Пидор");
    });
});

// Удаление юзера из списка лайков
router.post("/articles/delete-like", (req, res) => {
  deleteLikeArticle(req.body.articleId, req.body.userId)
    .then((response) => {
      console.log(response);
      res.send(response.value);
    })
    .catch(() => {
      console.log("Пидор");
    });
});

export default router;
