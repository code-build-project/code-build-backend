import mongodb from "mongodb";
import { Router } from "express";
import { getArticles, addLikeArticle, deleteLikeArticle } from "../models/articles.js";

const router = Router();
const { ObjectId } = mongodb;

// Получение списка статьей, с фильрацией по тегу
router.get("/articles", (req, res) => {
  const filter = {
    tags: req.query.tag
  }

  getArticles(filter)
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
  const filter = {
    likes: req.query.userId
  }

  getArticles(filter)
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
  const filter = {
    _id: ObjectId(req.body.articleId)
  }

  const operator = {
    $push: {likes: req.body.userId}
  }

  addLikeArticle(filter, operator)
    .then((response) => {
      res.send(response.value);
    })
    .catch(() => {
      console.log("Пидор");
    });
});

// Удаление юзера из списка лайков
router.post("/articles/delete-like", (req, res) => {
  const filter = {
    _id: ObjectId(req.body.articleId)
  }

  const operator = {
    $pull: {likes: req.body.userId}
  }

  deleteLikeArticle(filter, operator)
    .then((response) => {
      res.send(response.value);
    })
    .catch(() => {
      console.log("Пидор");
    });
});

export default router;
